#!/bin/bash

echo "*** CREATING DATABASE ***"

psql -U postgres -c 'create database brHome;'

echo "*** DATABASE CREATED! ***"