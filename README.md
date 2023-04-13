
<div align="center">
    <h3 align="center">CharlaBots</h3>
    <p align="center">
    DESCRIPTION HERE
    </p>
</div>

## About The Project

[![Slow Analysis Screen Shot][project-screenshot]](https://web.eecs.umich.edu/~mjguz/slow-analysis/)

ABOUT HERE

## Getting Started

First time setup:

1. If you are already using nvm (node version maanger)

Use the following command to set your node version

```bash
nvm use
```

If you aren't using nvm, you should, or you can install Node.js 18.12.1 from https://nodejs.org/en/. Just make sure you uninstall any existing node installations first.

1. Install required packages

All you have to do is run this command inside the project directory

```bash
npm install
```

That should be all the setup you need.

## Running the service

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Then, open your localhost at port 3000

http://localhost:3000/

(Highly recommend the Comment Anchors extension for VSCode)

##  Building the service

To build the service, run the following command:

```bash
npm run export
```

This will create a static version of the site in the `out` directory. You can then deploy this directory to the eecs server.

## Testing the service

To run the tests, run the following command: (Not Implemented)

```bash
npm run cypress
```

## Usage


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Contact

Project Link - [https://github.com/bsteinig/slow-analysis](https://github.com/bsteinig/slow-analysis)


[project-screenshot]: images/screenshot.png