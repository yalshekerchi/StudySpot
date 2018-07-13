import requests
import json

from api_keys import UWATERLOO_KEY

querystring = {"key":UWATERLOO_KEY}
term = "1185"

codes_subjects_url = "https://api.uwaterloo.ca/v2/codes/subjects.json"
codes_response = requests.request("GET", codes_subjects_url, headers=None, params=querystring)

codes_dict = json.loads(codes_response.text)
#print json.dumps(codes_dict, sort_keys=True, indent=4)

subject_list = []
for subject in codes_dict['data']:
  subject_list.append(str(subject['subject']))

result_dict = {}

total_size = 0
for subject in subject_list:
  codes_subjects_url = "https://api.uwaterloo.ca/v2/terms/" + term + "/" + subject + "/schedule.json"
  schedule_response = requests.request("GET", codes_subjects_url, headers=None, params=querystring)
  schedule_dict = json.loads(schedule_response.text)

  if schedule_dict['meta']['status'] != 200:
    print subject
    print schedule_dict
    continue
  else:
    for course in schedule_dict['data']:
      for class_ in course['classes']:
        building = class_['location']['building']
        room = class_['location']['room']

        if room is None:
          continue

        if building not in result_dict:
          result_dict[building] = {}

        if room not in result_dict[building]:
          result_dict[building][room] = []

        class_dict = dict(course)
        class_dict.pop('classes', None)
        class_dict['class'] = class_

        result_dict[building][room].append(class_dict)

    total_size += len(schedule_response.text.encode('utf-8'))
    print subject + ": " + str(len(schedule_response.text.encode('utf-8')))

print total_size
with open('result.json', 'w') as outfile:
    json.dump(result_dict, outfile, sort_keys=False, indent=4)