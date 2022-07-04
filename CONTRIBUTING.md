# SignalWire Community Contribution Guide

Thank you for taking the time to help improve SignalWire Community projects!

## Reporting an issue

Have you found a problem? Looking for a specific feature that is missing? You are welcome to [open a new issue](https://github.com/signalwire-community/react/issues/new).

## Making Changes

To make changes to the code, start by forking the repository to work locally. This monorepo contains, at its root, two important folders:

- [packages](./packages): the set of packages that will get published on NPM.
- [demo](./demo): a set of demos that you can use while developing the library code, to help yourself testing the components.

First, install the dependencies from the root of the repo:

```bash
npm install
```

Then, you can start building. To build the react package:

```bash
cd packages/react
npm run build
```

(note that you can use `npm run dev` to automatically rebuild the source files when they change)

To test your code within a sample application:

```bash
cd demo/video
npm run dev
```

After your changes are made, open a Pull Request and you will be guided towards merging your code in the main branch!
