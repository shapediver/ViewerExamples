rm -rf ./dist-dev
mkdir dist-dev
cp index.html dist-dev/index.html 
webpack-dev-server --watch-poll --config ../../webpack.dev.js --output dist-dev/bundle.js --content-base ./dist-dev --open