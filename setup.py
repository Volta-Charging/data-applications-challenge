# Copyright (c) 2018. All rights reserved.

from codecs import open
from os import path
import sys

from setuptools import find_packages
from setuptools import setup

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
    long_description = f.read()

requirements = ["python-dateutil>=2.1,<3.0.0",
                "docutils>=0.10",
                "plotly",
                "requests>=2.9.1"]

setup(
    name='chargingstation',
    version='0.1dev',
    description='Charging Station Map',
    long_description=long_description,
    license='Apache License 2.0',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: System Administrators',
        'License :: OSI Approved :: Apache License 2.0',
        'Natural Language :: English',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7,'
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4'
    ],
    scripts = ['charging_station_map'],
    packages=find_packages(exclude=['tests']),
    include_package_data=True,
    install_requires=requirements
)