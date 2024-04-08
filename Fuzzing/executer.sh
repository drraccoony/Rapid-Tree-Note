#!/bin/bash

./test_fuzz.sh $(/mnt/c/Users/mobre/Documents/GitHub/zzuf/zzuf-0.15/src/zzuf -c -s $(date +%s%N) -r 0.01 < ./link.txt)
