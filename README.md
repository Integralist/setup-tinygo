# setup-tinygo

[![Check dist/](https://github.com/integralist/setup-tinygo/actions/workflows/check-dist.yml/badge.svg)](https://github.com/integralist/setup-tinygo/actions/workflows/check-dist.yml)
[![Validate](https://github.com/integralist/setup-tinygo/actions/workflows/validate.yml/badge.svg)](https://github.com/integralist/setup-tinygo/actions/workflows/validate.yml)

This actions sets up a TinyGo environment for GitHub Actions.

## Usage

### Basic

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: integralist/setup-tinygo@v1
    with:
      tinygo-version: 0.20.0
```

### With matrix expansion

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        tinygo: ['0.19.0', '0.20.0']
    name: TinyGo ${{ matrix.tinygo }}
    steps:
      - uses: actions/checkout@v2
      - uses: integralist/setup-tinygo@v1
        with:
          tinygo-version: ${{ matrix.tinygo }}
```

### With custom Go version

TinyGo needs Go and, by default, this action will use whatever
version is available in the runner. If you want to control the
Go version, you can use `actions/setup-go` before `integralist/setup-tinygo`

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-go@v2
    with:
      go-version: 1.17
  - uses: integralist/setup-tinygo@v1
    with:
      tinygo-version: 0.20.0
```

## Why?

This is a fork of https://github.com/acifani/setup-tinygo and the reason for forking was to add support for `binaryen`. I had opened an issue ([here](https://github.com/acifani/setup-tinygo/issues/2)) but it received no response of any kind and I wasn't in a position to wait around so I decided I'd fork and implement the necessary changes myself.
