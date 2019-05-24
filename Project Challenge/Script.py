
import json
import requests

#!/usr/bin/env python
# based on  http://stackoverflow.com/questions/7052947/split-95mb-json-array-into-smaller-chunks
# usage: python json-split filename.json
# produces multiple filename_0.json of 1.49 MB size


with open(sys.argv[1],'r') as infile:
    o = json.load(infile)
    chunkSize = 4550
    for i in xrange(0, len(o), chunkSize):
        with open(sys.argv[1] + '_' + str(i//chunkSize) + '.json', 'w') as outfile:
            json.dump(o[i:i+chunkSize], outfile)

url = 'https://k1qbwyai1g.execute-api.us-east-1.amazonaws.com/dev/add-ingredients'
with open('./database.json', encoding="utf8") as fp:
    data = json.load(fp)


resp = requests.post(url=url, json=data)
response = resp.json() # Check the JSON Response Content documentation below

print("The response is " + str(response))
