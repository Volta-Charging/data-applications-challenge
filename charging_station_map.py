"""
"""

import requests
import plotly
import plotly.plotly as py

class VoltaChargingStationMap(object):
    def __init__(self):
        self.plot_data = {'lat':[], 'lon':[], 'text':[]}
        plotly.tools.set_credentials_file(username='DataChallenge', api_key='X554PK1cY0po0MNamO4D')

    def get_api_data(self, url):
        # get all data for charging station, this could be potenially slow, although right now seems fine
        r = requests.get(url)
        self.api_data = r.json()
        self.convert_api_to_plot_data()

    def convert_api_to_plot_data(self):
        for entry in self.api_data:
            if 'city' not in entry or not entry['city']:
                continue
            # extract latitude and longitude set it as top level key
            if 'location' in entry and 'coordinates' in entry['location']:
                self.plot_data['lat'].append(entry['location']['coordinates'][1])
                self.plot_data['lon'].append(entry['location']['coordinates'][0])
            text = entry['street_address'] + ", " + entry['city'] + ", " + str(entry['zip_code'])
            self.plot_data['text'].append(text)

    def plot_map(self):
        data = [ dict(
            type = 'scattergeo',
            lon = self.plot_data['lon'],
            lat = self.plot_data['lat'],
            text = self.plot_data['text'],
            mode = 'markers',
            marker = dict(
                size = 8,
                opacity = 0.8,
                reversescale = True,
                autocolorscale = False,
                symbol = 'square',
                line = dict(
                    width=1,
                    color='rgba(102, 102, 102)'
                ),
            cmin = 0,
            colorbar=dict(
                title="Volta Charging Station Map"
            )
        ))]

        layout = dict(
            title = 'Volta Charging Station<br>(Hover for Address)',
            colorbar = True,
            geo = dict(
                scope='north america',
                projection=dict(type = 'conic conformal',
                            rotation = dict(lon = -100)),
                showland = True,
                landcolor = "rgb(250, 250, 250)",
                subunitcolor = "rgb(217, 217, 217)",
                countrycolor = "rgb(217, 217, 217)",
                countrywidth = 0.5,
                subunitwidth = 0.5
            ),
        )

        fig = dict( data=data, layout=layout)
        py.plot( fig, validate=False, filename='Volta Charging Station' )

amap = VoltaChargingStationMap()
amap.get_api_data("https://api.voltaapi.com/v1/stations")
amap.plot_map()