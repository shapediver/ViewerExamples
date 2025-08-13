#!/usr/bin/env node

/**
 * Auto-generate llms.txt for the ShapeDiver Viewer Examples repository
 * This script analyzes usage patterns from actual examples
 */

import * as fs from "fs";
import * as path from "path";

interface ExampleInfo {
	category: string;
	name: string;
	description: string;
	categoryDescription: string;
	filePath: string;
	code: string;
	imports: ImportInfo[];
	apiCalls: APICall[];
	patterns: string[];
	complexity: 'basic' | 'intermediate' | 'advanced';
}

interface ImportInfo {
	module: string;
	namedImports: string[];
	namespaceImport?: string;
	defaultImport?: string;
}

interface APICall {
	type: string;
	params: string;
	fullMatch: string;
}

interface UsagePattern {
	name: string;
	count: number;
	examples: ExampleInfo[];
	description: string;
}

interface CodeSnippet {
	category: string;
	title: string;
	description: string;
	code: string;
	examples: string[];
}

class ExampleAnalyzer {
	private rootPath: string;
	private examples: ExampleInfo[] = [];
	private usagePatterns = new Map<string, UsagePattern>();
	private codeSnippets: CodeSnippet[] = [];

	constructor() {
		this.rootPath = process.cwd();
	}

	async generate(): Promise<boolean> {
		console.log("🔄 Analyzing examples and generating llms.txt...");

		try {
			// Analyze all examples
			await this.scanExamples();
			await this.extractUsagePatterns();
			await this.extractCodeSnippets();

			// Generate content
			const content = this.generateContent();

			// Write file
			fs.writeFileSync(path.join(this.rootPath, "llms.txt"), content);

			console.log(`✅ llms.txt generated from ${this.examples.length} examples!`);
			return true;
		} catch (error: any) {
			console.error("❌ Error generating llms.txt:", error.message);
			return false;
		}
	}

	private async scanExamples(): Promise<void> {
		const examplesDir = path.join(this.rootPath, "examples");
		if (!fs.existsSync(examplesDir)) return;

		this.scanDirectory(examplesDir, "");
	}

	private scanDirectory(dirPath: string, category: string): void {
		if (!fs.existsSync(dirPath)) return;

		const items = fs.readdirSync(dirPath);

		for (const item of items) {
			const fullPath = path.join(dirPath, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				const srcPath = path.join(fullPath, "src", "index.ts");
				const descPath = path.join(fullPath, "description.txt");

				if (fs.existsSync(srcPath)) {
					// This is an example directory
					const example = this.parseExample(fullPath, srcPath, descPath, category, item);
					if (example) {
						this.examples.push(example);
					}
				} else {
					// Continue scanning subdirectories
					const newCategory = category ? `${category}/${item}` : item;
					this.scanDirectory(fullPath, newCategory);
				}
			}
		}
	}

	private parseExample(
		examplePath: string, 
		srcPath: string, 
		descPath: string, 
		category: string, 
		name: string
	): ExampleInfo | null {
		try {
			const code = fs.readFileSync(srcPath, "utf8");
			let description = "";

			if (fs.existsSync(descPath)) {
				description = fs.readFileSync(descPath, "utf8").trim();
			}

			// Extract README if exists
			const readmePath = path.join(path.dirname(examplePath), "README.md");
			let categoryDescription = "";
			if (fs.existsSync(readmePath)) {
				const readme = fs.readFileSync(readmePath, "utf8");
				const match = readme.match(/### .+\n\n([^_]+)/);
				if (match) {
					categoryDescription = match[1].trim();
				}
			}

			return {
				category: category || "general",
				name,
				description,
				categoryDescription,
				filePath: srcPath,
				code,
				imports: this.extractImports(code),
				apiCalls: this.extractAPICalls(code),
				patterns: this.extractPatterns(code),
				complexity: this.assessComplexity(code)
			};
		} catch (error: any) {
			console.warn(`⚠️  Failed to parse example at ${srcPath}:`, error.message);
			return null;
		}
	}

	private extractImports(code: string): ImportInfo[] {
		const imports: ImportInfo[] = [];
		const importRegex = /import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+["']([^"']+)["']/g;
		let match;

		while ((match = importRegex.exec(code)) !== null) {
			const [, namedImports, namespaceImport, defaultImport, module] = match;
			imports.push({
				module,
				namedImports: namedImports ? namedImports.split(',').map(s => s.trim()) : [],
				namespaceImport,
				defaultImport
			});
		}

		return imports;
	}

	private extractAPICalls(code: string): APICall[] {
		const calls: APICall[] = [];
		const patterns = [
			{ name: 'createViewport', regex: /createViewport\s*\(\s*\{([^}]+)\}\s*\)/g },
			{ name: 'createSession', regex: /createSession\s*\(\s*\{([^}]+)\}\s*\)/g },
			{ name: 'getParameterByName', regex: /\.getParameterByName\s*\(\s*["']([^"']+)["']\s*\)/g },
			{ name: 'getOutputByName', regex: /\.getOutputByName\s*\(\s*["']([^"']+)["']\s*\)/g },
			{ name: 'getExportByName', regex: /\.getExportByName\s*\(\s*["']([^"']+)["']\s*\)/g },
			{ name: 'customize', regex: /\.customize\s*\(\s*([^)]*)\s*\)/g },
			{ name: 'addListener', regex: /addListener\s*\(\s*([^,]+),/g },
			{ name: 'addPostProcessingEffect', regex: /addPostProcessingEffect\s*\(\s*\{([^}]+)\}/g },
			{ name: 'createLightScene', regex: /createLightScene\s*\(\s*([^)]*)\s*\)/g },
		];

		for (const pattern of patterns) {
			let match;
			while ((match = pattern.regex.exec(code)) !== null) {
				calls.push({
					type: pattern.name,
					params: match[1] ? match[1].trim() : '',
					fullMatch: match[0]
				});
			}
		}

		return calls;
	}

	private extractPatterns(code: string): string[] {
		const patterns: string[] = [];

		// Check for common patterns
		if (code.includes('createViewport') && code.includes('createSession')) {
			patterns.push('basic-setup');
		}
		if (code.includes('InteractionEngine')) {
			patterns.push('interactions');
		}
		if (code.includes('MaterialStandardData')) {
			patterns.push('materials');
		}
		if (code.includes('updateCallback')) {
			patterns.push('output-callbacks');
		}
		if (code.includes('addPostProcessingEffect')) {
			patterns.push('post-processing');
		}
		if (code.includes('createLightScene')) {
			patterns.push('lighting');
		}
		if (code.includes('addListener')) {
			patterns.push('events');
		}
		if (code.includes('.customize(')) {
			patterns.push('customization');
		}
		if (code.includes('request()')) {
			patterns.push('exports');
		}
		if (code.includes('Gumball')) {
			patterns.push('gumball');
		}
		if (code.includes('createDrawingTools')) {
			patterns.push('drawing-tools');
		}

		return patterns;
	}

	private assessComplexity(code: string): 'basic' | 'intermediate' | 'advanced' {
		let score = 0;
		if (code.includes('createViewport')) score += 1;
		if (code.includes('createSession')) score += 1;
		if (code.includes('InteractionEngine')) score += 2;
		if (code.includes('addPostProcessingEffect')) score += 2;
		if (code.includes('createLightScene')) score += 2;
		if (code.includes('updateCallback')) score += 1;
		if (code.includes('mat4') || code.includes('vec3')) score += 2;
		if (code.includes('traverse')) score += 1;

		if (score <= 2) return 'basic';
		if (score <= 5) return 'intermediate';
		return 'advanced';
	}

	async extractUsagePatterns() {
		// Group examples by patterns
		const patternGroups = new Map();

		this.examples.forEach(example => {
			example.patterns.forEach(pattern => {
				if (!patternGroups.has(pattern)) {
					patternGroups.set(pattern, []);
				}
				patternGroups.get(pattern).push(example);
			});
		});

		// Convert to usage patterns with examples
		patternGroups.forEach((examples, pattern) => {
			this.usagePatterns.set(pattern, {
				name: pattern,
				count: examples.length,
				examples: examples.slice(0, 5), // Limit to 5 examples per pattern
				description: this.getPatternDescription(pattern)
			});
		});
	}

	private getPatternDescription(pattern: string): string {
		const descriptions: Record<string, string> = {
			'basic-setup': 'Creating viewport and session for 3D visualization',
			'interactions': 'User interaction with 3D objects (selection, hover, drag)',
			'materials': 'Creating and applying PBR materials to geometry',
			'output-callbacks': 'Handling dynamic updates when model outputs change',
			'post-processing': 'Visual effects like SSAO, bloom, outline, depth of field',
			'lighting': 'Custom lighting setups with multiple light types',
			'events': 'Listening to API events and user interactions',
			'customization': 'Updating parameters and regenerating models',
			'exports': 'Requesting and downloading model exports',
			'gumball': '3D transformation gizmo for object manipulation',
			'drawing-tools': 'Interactive drawing and line creation tools'
		};
		return descriptions[pattern] || pattern;
	}

	async extractCodeSnippets() {
		// Extract key code patterns for common use cases
		for (const example of this.examples) {
			// Basic setup pattern
			if (example.patterns.includes('basic-setup')) {
				const viewportMatch = example.code.match(/createViewport\s*\(\s*\{[^}]+\}\s*\)/);
				const sessionMatch = example.code.match(/createSession\s*\(\s*\{[^}]+\}\s*\)/);
				
				if (viewportMatch && sessionMatch) {
					this.codeSnippets.push({
						category: 'Basic Setup',
						title: 'Creating Viewport and Session',
						description: 'Standard initialization pattern',
						code: `${viewportMatch[0]};\n\n${sessionMatch[0]};`,
						examples: [example.name]
					});
					break; // Only need one example of this pattern
				}
			}
		}

		// Parameter customization pattern
		const customizationExample = this.examples.find(ex => 
			ex.patterns.includes('customization') && 
			ex.code.includes('getParameterByName')
		);
		if (customizationExample) {
			const lines = customizationExample.code.split('\n');
			const startIdx = lines.findIndex(line => line.includes('getParameterByName'));
			const endIdx = lines.findIndex((line, idx) => idx > startIdx && line.includes('.customize()'));
			
			if (startIdx !== -1 && endIdx !== -1) {
				const snippet = lines.slice(startIdx, endIdx + 1)
					.map(line => line.trim())
					.filter(line => line && !line.startsWith('//'))
					.join('\n');
				
				this.codeSnippets.push({
					category: 'Parameter Control',
					title: 'Updating Parameters and Customizing Model',
					description: 'Standard parameter modification workflow',
					code: snippet,
					examples: [customizationExample.name]
				});
			}
		}

		// Interaction pattern
		const interactionExample = this.examples.find(ex => 
			ex.patterns.includes('interactions') && 
			ex.code.includes('InteractionEngine')
		);
		if (interactionExample) {
			const engineMatch = interactionExample.code.match(/new InteractionEngine\([^)]+\);/);
			const managerMatch = interactionExample.code.match(/new SelectManager\(\);/);
			const addMatch = interactionExample.code.match(/interactionEngine\.addInteractionManager\([^)]+\);/);
			
			if (engineMatch && managerMatch && addMatch) {
				this.codeSnippets.push({
					category: 'User Interactions',
					title: 'Setting up Object Selection',
					description: 'Enable user interaction with 3D objects',
					code: [engineMatch[0], managerMatch[0], addMatch[0]].join('\n'),
					examples: [interactionExample.name]
				});
			}
		}

		// Material pattern
		const materialExample = this.examples.find(ex => 
			ex.patterns.includes('materials') && 
			ex.code.includes('MaterialStandardData')
		);
		if (materialExample) {
			const materialMatch = materialExample.code.match(/new MaterialStandardData\s*\(\s*\{[^}]+\}\s*\)/);
			if (materialMatch) {
				this.codeSnippets.push({
					category: 'Materials',
					title: 'Creating PBR Materials',
					description: 'Define material properties for realistic rendering',
					code: materialMatch[0],
					examples: [materialExample.name]
				});
			}
		}
	}

	generateContent() {
		const timestamp = new Date().toISOString().split('T')[0];
		const categories = [...new Set(this.examples.map(ex => ex.category.split('/')[0]))];

		return `# ShapeDiver Viewer Examples Analysis

This document analyzes ${this.examples.length} working examples from the ShapeDiver Viewer Examples repository to demonstrate real-world usage patterns and best practices.

**Generated**: ${timestamp}  
**Repository**: ShapeDiver/ViewerExamples  
**Examples Analyzed**: ${this.examples.length}  
**Categories**: ${categories.length}

## Usage Pattern Analysis

${Array.from(this.usagePatterns.values())
	.sort((a, b) => b.count - a.count)
	.map(pattern => 
		`### ${pattern.name.charAt(0).toUpperCase() + pattern.name.slice(1).replace('-', ' ')}
${pattern.description}
- **Usage**: Found in ${pattern.count} examples
- **Examples**: ${pattern.examples.map(ex => `${ex.category}/${ex.name}`).join(', ')}`
	).join('\n\n')}

## Code Patterns from Examples

${this.codeSnippets.map(snippet => 
	`### ${snippet.title}
*${snippet.description}*

\`\`\`typescript
${snippet.code}
\`\`\`

**Used in**: ${snippet.examples.join(', ')}`
).join('\n\n')}

## Example Categories Overview

${categories.map(category => {
	const categoryExamples = this.examples.filter(ex => ex.category.startsWith(category));
	const complexityDistribution = ['basic', 'intermediate', 'advanced'].map(level => 
		categoryExamples.filter(ex => ex.complexity === level).length
	);
	
	// Get category description from first example's category description
	const categoryDesc = categoryExamples.find(ex => ex.categoryDescription)?.categoryDescription || '';
	
	return `### ${category.charAt(0).toUpperCase() + category.slice(1)}
${categoryDesc ? `${categoryDesc}\n` : ''}**Examples**: ${categoryExamples.length}  
**Complexity**: ${complexityDistribution[0]} basic, ${complexityDistribution[1]} intermediate, ${complexityDistribution[2]} advanced

${categoryExamples.slice(0, 8).map(ex => 
	`- **${ex.name}**: ${ex.description || 'Example showing ' + ex.name.replace(/_/g, ' ')}`
).join('\n')}${categoryExamples.length > 8 ? `\n- *...and ${categoryExamples.length - 8} more*` : ''}`;
}).join('\n\n')}

## Common API Patterns from Examples

### Import Patterns
${this.getTopImportPatterns().map(pattern => 
	`\`\`\`typescript
${pattern.code}
\`\`\`
*Used in ${pattern.count} examples*`
).join('\n\n')}

### Initialization Patterns
${this.getInitializationPatterns().map(pattern => 
	`**${pattern.title}**: ${pattern.description}
\`\`\`typescript
${pattern.code}
\`\`\`
*Found in ${pattern.examples.length} examples: ${pattern.examples.slice(0, 3).join(', ')}${pattern.examples.length > 3 ? ` and ${pattern.examples.length - 3} more` : ''}*`
).join('\n\n')}

## API Usage Statistics

### Most Used API Calls
${this.getAPiUsageStats().slice(0, 10).map(stat => 
	`- **${stat.call}**: ${stat.count} examples`
).join('\n')}

### Package Dependencies
${this.getPackageDependencies().map(dep => 
	`- **${dep.package}**: ${dep.count} examples${dep.features.length > 0 ? ` (${dep.features.join(', ')})` : ''}`
).join('\n')}

## Complexity Analysis

- **Basic Examples**: ${this.examples.filter(ex => ex.complexity === 'basic').length} (simple viewport/session setup)
- **Intermediate Examples**: ${this.examples.filter(ex => ex.complexity === 'intermediate').length} (interactions, materials, lighting)
- **Advanced Examples**: ${this.examples.filter(ex => ex.complexity === 'advanced').length} (complex effects, custom rendering, math operations)

## Example File Locations

All examples are located in the \`examples/\` directory with the following structure:
\`\`\`
examples/
├── category/
│   ├── README.md              # Category overview
│   └── example_name/
│       ├── description.txt    # Example description
│       ├── example.html      # Demo page
│       └── src/
│           └── index.ts      # Main example code
\`\`\`

## Best Practices Observed

1. **Consistent Setup Pattern**: Most examples follow the createViewport() → createSession() pattern
2. **Error Handling**: Advanced examples include try/catch blocks for robust operation
3. **Event Management**: Examples properly add/remove event listeners to prevent memory leaks
4. **Version Control**: Examples call updateVersion() after modifying scene graph nodes
5. **Resource Management**: Examples properly manage viewport visibility and flags

---

*This analysis was automatically generated by parsing ${this.examples.length} TypeScript example files on ${timestamp}.*
`;
	}

	getTopImportPatterns() {
		const importCounts = new Map();
		
		this.examples.forEach(example => {
			example.imports.forEach(imp => {
				if (imp.module.includes('@shapediver/viewer')) {
					const key = `import { ${imp.namedImports.join(', ')} } from "${imp.module}";`;
					importCounts.set(key, (importCounts.get(key) || 0) + 1);
				}
			});
		});

		return Array.from(importCounts.entries())
			.sort(([,a], [,b]) => b - a)
			.slice(0, 5)
			.map(([code, count]) => ({ code, count }));
	}

	getInitializationPatterns() {
		const patterns = [];
		
		// Find viewport patterns
		const viewportExamples = this.examples.filter(ex => 
			ex.apiCalls.some(call => call.type === 'createViewport')
		);
		
		if (viewportExamples.length > 0) {
			const example = viewportExamples[0];
			const call = example.apiCalls.find(call => call.type === 'createViewport');
			if (call) {
				patterns.push({
					title: 'Viewport Creation',
					description: 'Standard viewport initialization with canvas',
					code: `const viewport = await createViewport({\n  ${call.params.replace(/,\s*/g, ',\n  ')}\n});`,
					examples: viewportExamples.map(ex => ex.name)
				});
			}
		}

		// Find session patterns
		const sessionExamples = this.examples.filter(ex => 
			ex.apiCalls.some(call => call.type === 'createSession')
		);
		
		if (sessionExamples.length > 0) {
			const example = sessionExamples[0];
			const call = example.apiCalls.find(call => call.type === 'createSession');
			if (call) {
				patterns.push({
					title: 'Session Creation',
					description: 'Standard session initialization with ticket',
					code: `const session = await createSession({\n  ${call.params.replace(/,\s*/g, ',\n  ')}\n});`,
					examples: sessionExamples.map(ex => ex.name)
				});
			}
		}

		return patterns;
	}

	getAPiUsageStats() {
		const callCounts = new Map();
		
		this.examples.forEach(example => {
			example.apiCalls.forEach(call => {
				callCounts.set(call.type, (callCounts.get(call.type) || 0) + 1);
			});
		});

		return Array.from(callCounts.entries())
			.sort(([,a], [,b]) => b - a)
			.map(([call, count]) => ({ call, count }));
	}

	getPackageDependencies() {
		const packageCounts = new Map();
		
		this.examples.forEach(example => {
			example.imports.forEach(imp => {
				if (imp.module.includes('@shapediver/viewer')) {
					const basePackage = imp.module.includes('.features.') 
						? imp.module 
						: '@shapediver/viewer';
					
					if (!packageCounts.has(basePackage)) {
						packageCounts.set(basePackage, { count: 0, features: new Set() });
					}
					
					packageCounts.get(basePackage).count++;
					
					if (imp.namedImports) {
						imp.namedImports.forEach(feature => {
							packageCounts.get(basePackage).features.add(feature);
						});
					}
				}
			});
		});

		return Array.from(packageCounts.entries())
			.sort(([,a], [,b]) => b.count - a.count)
			.map(([pkg, data]) => ({
				package: pkg,
				count: data.count,
				features: Array.from(data.features).slice(0, 5) // Top 5 features
			}));
	}
}

// CLI execution
if (require.main === module) {
	const analyzer = new ExampleAnalyzer();
	analyzer.generate().then((success: boolean) => {
		process.exit(success ? 0 : 1);
	});
}

export default ExampleAnalyzer;
