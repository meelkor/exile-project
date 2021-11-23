scripts=`dirname $0`

$scripts/../../devtools/bin/svg-to-ttf \
    -n exile-client-icons \
    -o $scripts/../src/resources/fonts/icons \
    $scripts/../src/resources/font-icons/*

