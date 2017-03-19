#!/usr/bin/env bash
echo "======= Installing mocha ============="
npm install -g mocha >/dev/null 2>&1
echo "======= Installing mocha completed ============="
echo " "
echo "======= Installing application dependencies ============="
npm install >/dev/null 2>&1
echo "======= Installing application dependencies ============="
echo " "
echo " Running applicatin tests"
exec $@
