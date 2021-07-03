#! /bin/sh

#CHECK IF SSL_ENABLE ENVIRONMENT VARIABLE IS TRUE
if [ "$SSL_ENABLE" = "true" ]; then
    touch /etc/ca-certs.pem
    touch /etc/server.key
    envsubst < /usr/share/nginx/nginx.conf.ssl.template > /etc/nginx/nginx.conf
    [ -n "${SSL_CERTIFICATE+1}" ]     && echo "$SSL_CERTIFICATE_PEM"     >>/etc/ca-certs.pem
    [ -n "${SSL_CERTIFICATE_KEY+1}" ] && echo "$SSL_CERTIFICATE_KEY" >>/etc/server.key
fi

echo "window['apiUrl'] = '${BE_URL}';" >/usr/share/nginx/html/assets/config.js
echo "window['keycloakUrl'] = '${KC_URL}';" >>/usr/share/nginx/html/assets/config.js

# run nginx
nginx -g "daemon off;"
