# ENV variables required 
# DEPLOY_LOG_FILE - absolute path to deploy log file
# DEPLOY_DIR - absolute path to directory connected to git repo

# optional env variables
# TG_TEXT_PREFIX - text added to each tg message
# TG_CHAT_ID - telegram chatid for send messages
# TG_BOT_ID - telegram bot id for send messages

#unclude utils
. $(dirname "$0")/utils.sh

deploy_dir=${DEPLOY_DIR}

tg_message "Deploy started"

cd $deploy_dir 2>&1

echo "deploy dir: $deploy_dir"

echo "cleanup"

tg_message "pull changes from git started"

git checkout .

git pull origin master 2>&1

exit_if_error "git pull failed"

rm -rf node_modules dist

echo "install dependencies"

tg_message "install dependencies started"

yarn && yarn prepare 2>&1

exit_if_error "install dependencies failed"

tg_message "build started"

yarn build 2>&1

exit_if_error "build failed"

tg_message "start update site"

rm -rf /var/www/messenger/*

cp -rf $deploy_dir/dist/* /var/www/messenger 2>/dev/null

chown -R www-data:www-data /var/www/messenger

tg_message "deploy completed"

exit
exit
exit

exit
exit
exit