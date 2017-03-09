# What is QED?

QED is a multi-screen projector system written in Javascript. Source is available as free software/open source under[Apache license 2.0](./LICENSE).

## Description

QED was inspired by a latin phrase `quod erat demonstrandum` meaning `which is what had to be proven`. Traditionally used in mathematics, since this software was primarily written for [MSRI](http://www.msri.org/web/msri) it seemed appropriate.

QED is a simple and cost-effective way for beamer or powerpoint presentations to use 3 screens to show three consecutive slide, with automatic updating, and without requiring anything special of the presenter.  The system currently requires a "server" to which one uploads an ordinary beamer file and 3 projectors each connected to a commodity PC on the same network.

## Basic Architecture

<picture>
  <source src=https://github.com/harshavardhana/qed/raw/master/QED.png type=image/png >
  <img src="https://github.com/harshavardhana/qed/raw/master/QED.png" alt="QED Overview">
</picture>

## How to install QED ?

QED has some server side dependencies which needs to be installed first.

### Installing NodeJS using NVM on (Ubuntu 15.10)

An alternative to installing Node.js through ``apt`` is to use a specially designed tool called nvm, which stands for "Node.js version manager".

Using nvm, you can install multiple, self-contained versions of Node.js which will allow you to control your environment easier. It will give you on-demand access to the newest versions of Node.js, but will also allow you to target previous releases that your app may depend on.

To start off, we'll need to get the software packages from our Ubuntu repositories that will allow us to build source packages. The nvm script will leverage these tools to build the necessary components:

```
$ sudo apt-get update
$ sudo apt-get install build-essential libssl-dev
```

Once the prerequisite packages are installed, you can pull down the nvm installation script from the project's GitHub page. The version number may be different, but in general, you can download and install it with the following syntax:

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
$ nvm ls-remote
...
v6.8.0
v6.8.1
v6.9.0   (LTS: Boron)
v6.9.1   (LTS: Boron)
v6.9.2   (LTS: Boron)
v6.9.3   (LTS: Boron)
v6.9.4   (LTS: Boron)
v6.9.5   (LTS: Boron)
v6.10.0   (Latest LTS: Boron)
```

The newest version at the time of this writing is `6.10.0`. You can install that by typing:

```
$ nvm install 6.10.0
```

Usually, nvm will switch to use the most recently installed version. You can explicitly tell nvm to use the version we just downloaded by typing

```
$ nvm use v6.10.0
```

When you install Node.js using nvm, the executable is called node. You can see the version currently being used by the shell by typing:

```
$ node -v
v6.10.0
```

### Installing QED

Prerequisite please install 'git' version control system.

```
$ sudo apt-get install git
$ git clone https://github.com/harshavardhana/qed.git
$ cd qed
```

After you have cloned the repository, please use npm to install all the `QED` dependencies (all dependencies will be automatically installed)

```
$ npm install
```

### Configuring QED

Now that we have successfully installed QED, we are ready to make configuration changes i.e ``config.json``

```js
$ cat config.json
{
    "server": {
        "port": 80,
        "root": "web",
        "host": "0.0.0.0"
    },
    "socket": {
        "port": 4002,
        "root": "web",
        "host": "0.0.0.0"
    },
    "projectors": {
        "projector1": "10.0.0.25",
        "projector2": "10.0.0.5",
        "projector3": "10.0.0.53"
    }
}
```

Configuration 'server' and 'socket' by default listen on all the IPs at ports `4001` and `4002` respectively.  You can configure them to use a different port of your choice depending on your local infrastructure. `projectors` are the commodify PC's which are connected to your projectors they need to have a static IP.

NOTE: Make sure that the projector association is in accordance with the project installation at your site, to allow for proper slides to be displayed on relevant screens.

### Starting QED

Now simply start `./start-services.js`

```
$ ./start-services.js
### Starting local server

Web server running at:
http://127.0.0.1:4001
http://10.237.205.192:4001

Socker server running at:
ws://127.0.0.1:4002
ws://10.237.205.192:4002

Uploaded files will be saved to web/uploaded
Remember to clean this directory from time to time, if you end up uploading lots of files.
```

QED is now running at port `4001` , now open the link in your browser [http://localhost:4001](http://localhost:4001) to start using QED.

### How to Enable QED to start automatically after system restart?

QED provides a convenient shell script to enable QED upon system restart.

```
$ ./enable-rc-local qeduser
```

This script will automatically add following line into your `/etc/rc.local`

```
$ cat /etc/rc.local
(sudo -u qeduser bash -c \"cd /home/qeduser/qed && ./start-services.js\")&
```

NOTE: Following automation will only work on Linux operating systems.

## How to update QED ?

Currently the update mechanism is based on pulling sources directly into your local repository.

Fetch new changes
```
$ cd qed
$ git pull --rebase
```

Killall any running services and restart QED.
```
$ sudo killall node
$ sudo /etc/rc.local
```

## User Feedback

If you have any problems with or questions, please contact us through a GitHub issue.

## Contributing
You are invited to contribute new features, fixes, or updates, large or small; we are always thrilled to receive pull requests, and do our best to process them as fast as we can.

Before you start to code, we recommend discussing your plans through a GitHub issue, especially for more ambitious contributions. This gives other contributors a chance to point you in the right direction, give you feedback on your design, and help you find out if someone else is working on the same thing.
