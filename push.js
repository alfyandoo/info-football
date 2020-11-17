var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BJhtxSLZklnxlIlg2jS1RrH1R-405sKA4zM3Oq6nh-h6qMOPAwPiPPnseCJsYWeVcIyJloEC3Dt88nlMJ7zhkx4",
   "privateKey": "mvQZexC0LoBQSHo89LWe67HFKan_UPkefZFi1AMPwHs"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": " https://fcm.googleapis.com/fcm/send/eJeN7ds63-0:APA91bGrZijbVy2QMUq_YbZ19JXGeb2DpgITudKNwl8o7-y_C_QXcMwK4CIS5fHCKUMJWbrpsmEgXlKVhfXNlDlBqsOyDNYj3k0itvKvR_M9axunASSpmulBiUr2qnwchywGm0I51TS3",
   "keys": {
       "p256dh": "BEaJsetsDvMW2rXfkLybcjIhfKVYRDvnPchztLEnHi4Nicj1hW6v4YbdSZnRXMqmTkjTF9RjRiaY3UldTFe7Qa8=",
       "auth": "ulfQRMwYF43eyO2wc6Elkw=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '931067109013',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);