#! /bin/sh

# add other variables to be subsituted inside default.conf.tempkate
envsubst '${LISTEN_PORT} ${UTP_PATH} ${UTP_BE_PATH} ${UTP_ETL_PATH} ${KC_ENABLED} ${KC_URL} ${KC_REALM} ${KC_CLIENT_ID}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# run nginx
nginx -g 'daemon off;'
