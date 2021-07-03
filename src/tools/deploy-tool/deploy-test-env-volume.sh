#!/bin/sh

# resync jar file and restart container

echo "Deploying not-bug frontend..."
component_name="mtsuites-deploy_nginx_1"
build_path="../../../dist/front/"
destination_path="/var/lib/docker/volumes/mtsuites-deploy_nginx-web_data/_data/"

rsync -avhz --no-perms --no-owner --no-group --delete --partial -e "ssh -i ~/ssl/not-bug-cert.pem" $build_path root@66.97.43.52:$destination_path
ssh -i "~/ssl/not-bug-cert.pem" -t root@66.97.43.52 "docker restart $component_name"
echo "Deploy success"

