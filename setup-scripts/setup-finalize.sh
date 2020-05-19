#! /usr/bin/env bash

set -e # exit on first error

# dedupe PATH entries that we might have caused by running scripts multiple times
PATH="$(perl -e 'print join(":", grep { not $seen{$_}++ } split(/:/, $ENV{PATH}))')"