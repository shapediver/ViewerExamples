import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// ── S3 configuration ─────────────────────────────────────────────────────────
const BUCKET = 'shapediverviewer';
const DEPLOY_ENV = process.env.DEPLOY_ENV ?? 'staging';
const PREFIX = DEPLOY_ENV === 'prod' ? 'v3/examples/' : 'v3/examples-staging/'; // key prefix inside the bucket
// ─────────────────────────────────────────────────────────────────────────────

const DIST_DIR = path.resolve('dist');

const client = new S3Client({ maxAttempts: 5, region: "us-east-1" });

/** Return the MIME type for a given file extension. */
function contentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const types: Record<string, string> = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain',
        '.map': 'application/json',
    };
    return types[ext] ?? 'application/octet-stream';
}

/** Recursively collect all files under a directory. */
function collectFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectFiles(full));
        } else {
            files.push(full);
        }
    }
    return files;
}

const CONCURRENCY = 20;

async function uploadFile(file: string, uploaded: { count: number }, total: number) {
    const relative = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    const key = PREFIX + relative;

    await client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fs.readFileSync(file),
        ContentType: contentType(file),
        ACL: "public-read",
        CacheControl: "max-age=0, s-maxage=608400, must-revalidate"
    }));

    uploaded.count++;
    process.stdout.write(`\r${uploaded.count}/${total} uploaded`);
}

async function deploy() {
    const files = collectFiles(DIST_DIR);
    console.log(`Uploading ${files.length} files to s3://${BUCKET}/${PREFIX} (concurrency: ${CONCURRENCY})`);

    const uploaded = { count: 0 };
    const queue = [...files];

    async function worker() {
        while (queue.length > 0) {
            const file = queue.shift()!;
            await uploadFile(file, uploaded, files.length);
        }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));

    console.log(`\nDone — ${uploaded.count} files uploaded to s3://${BUCKET}/${PREFIX}`);
}

deploy().catch(err => {
    console.error(err);
    process.exit(1);
});
