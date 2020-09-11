# Audio-video conference 
A web application that allows real-time video conferencing with desktop sharing.

Project for laboratory classes at the Poznan University of Technology. 

### Project architecture
#### Main architecture
![](https://i.imgur.com/lB6CYdL.png "Server architecture")
#### Media Server architecture - SFU (Selective Forwarding Unit)
![](https://bloggeek.me/wp-content/uploads/2016/03/201603-sfu-processing.png "SFU")

### __Technologies__ 
- WebRTC
- Typescript
- Vue

### __Maintainers__
- Dziurzyński Miłosz
- Gawiński Wojciech
- Kmiotek Jarosław
- Sobański Rafał

## Deployment
You can easily deploy the project using a docker-compose file.
```
cd docker
docker-compose up
```
The default port is 5051, you can change it in the docker-compose.yml file.

## Manual setup

### __Prerequisites__
- [Ubuntu 18.04](https://help.ubuntu.com/community/Installation/MinimalCD)
- [nginx](http://nginx.org/en/linux_packages.html#Ubuntu)
- [Node.js](https://github.com/nodesource/distributions#debinstall)
- [Kurento Media Server](https://doc-kurento.readthedocs.io/en/stable/user/installation.html#local-installation)
- Redis Server

### __Setup__
Change the default WebSocket port of the Kurento Media Server from 8888 to 8890
```
sudo nano /etc/kurento/kurento.conf.json
sudo systemctl restart kurento-media-server
```
Get other required packages and the repo contents
```
sudo apt install git screen
git clone https://github.com/djmuted/PTL_Proj
cd PTL_Proj
```
Download all required packages for the signaling server
```
cd signal
npm i
cd ..
```
Download all required packages for the client
```
cd client-frontend
npm install
cd ..
```

### __Start__
#### Start the signaling server
```
cd signal
screen -S signal npm start
```
And press CTRL+A+D to detach the server and let it run in the background, after doing that come back to the main repo directory
```
cd ..
```
#### Start the client dev webhost
```
cd client-frontend
screen -S web npm start
```

#### WARNING: WebRTC does NOT work with unencrypted HTTP. HTTPS with a valid SSL certificate is required in recent Chrome and Firefox versions. The only exception is localhost, which will work with HTTP.
