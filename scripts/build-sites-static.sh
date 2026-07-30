#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/.." && pwd)"
build_dir="$project_root/dist"

rm -rf "$build_dir"
mkdir -p "$build_dir/client" "$build_dir/server"

cp "$project_root"/*.html "$project_root"/*.js "$project_root"/*.css "$build_dir/client/"
cp -R "$project_root/assets" "$build_dir/client/assets"
cp "$project_root/hosting/worker.js" "$build_dir/server/index.js"
cp "$project_root/hosting/wrangler.json" "$build_dir/wrangler.json"

printf '%s\n' "$build_dir"
