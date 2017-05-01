# refocus-simple-lens

## SimpleLens

A realtime whaack-a-mole game. Try to improve on this!

![whack a mole picture](/whackAMole.png)

### Setup

1. Git clone this repo.

        git clone https://github.com/annyhe/refocus-simple-lens

1. Install the Refocus Lens Developer Kit.

        git clone https://github.com/salesforce/refocus-ldk
        cd refocus-ldk
        npm install

1. Copy this lens into your `refocus-ldk/Lenses` directory.

        cp -r ../refocus-lens-tree/SimpleLens Lenses

1. Configure the Refocus LDK.

        npm config set refocus-ldk:lens SimpleLens

### Test

Run the Refocus LDK's `test` script to run all the tests under `refocus-ldk/Lenses/SimpleLens/test`.

```
npm run test
```

### Build

Run the Refocus LDK's `build` script to generate the lens library (`refocus-ldk/dist/SimpleLens.zip`).

```
npm run build
```

### Deploy

Use the Refocus UI or API (`/v1/lenses`) to deploy the lens.