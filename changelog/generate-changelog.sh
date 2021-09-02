#!/usr/bin/env bash
set -e

# Generate CHANGELOG.md from changelog directory
# Requires:
# - curl installed

# Config

main_version='v1.0.1'
export main_filename='generate-changelog-main.sh'
export main_url="https://gitlab.com/NebulousLabs/changelog-generator/-/raw/${main_version}/${main_filename}"
export temp_dir="${HOME}/.nebulous/changelog-generator"
export main_path=${temp_dir}/${main_filename}

# Set working dir to script location
pushd $(dirname "$0") > /dev/null

# If executed in 'changelog-generator' repo, do not use the older released
# version, use the latest local version
repo_dir="$(basename ${PWD%/*})"
if [[ "${repo_dir}" == "changelog-generator" ]]
then
    # Call the latest local main script
    echo "Executing the latest local version of the main script"
    export local_execution=true
    chmod +x ../${main_filename}
    ../${main_filename} "$@"
    exit 0
fi

# Download main script to temp dir
mkdir -p ${temp_dir}
curl --show-error --fail -o ${main_path} ${main_url}

# Execute downloaded main script passing arguments to the main script
chmod +x ${main_path}
${main_path} "$@"

popd > /dev/null
