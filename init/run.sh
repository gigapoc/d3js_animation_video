#!/bin/bash

rm images/*
phantomjs index.js
for l in $(ls images/*.svg)
do
    convert $l $l.png
done
ffmpeg -framerate 60 -i ./images/image_%03d.svg.png -c:v libx264 -r 24  out.mp4
