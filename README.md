# StudySpot

StudySpot provides quick, simple access to classroom information.

It allows you to find available classrooms which you can use for studying or group work as well as explore the schedule of any classroom on University of Waterloo's campus. Simply provide the building(s), date, and time you would like to find available rooms at and StudySpot will provide you with rooms which have no classes scheduled. 

StudySpot also offers a general Room Explorer feature which shows you all buildings on campus and allows you to view the schedule of any classrooms. StudySpot also provides an embedded version of the [University of Waterloo Campus Map](https://uwaterloo.ca/map/) which allows users to easily locate the building locations and classroom locations (if connected to a UW network).

The classroom schedule information is obtained from the [University of Waterloo Open Data API](https://uwaterloo.ca/api/) and scraped into a MongoDB database. The database allows for efficient and more aggregated querying of schedule information as opposed using the UW API directly.



The webapp is currently hosted over at https://uw-studyspot.herokuapp.com/

## Built With

* [React](https://reactjs.org/) - Framework used to design the front-end UI
* [Express](https://expressjs.com/) - Back-end web application framework
* [MongoDB](https://www.mongodb.com/) - Database used to store required data
* [Node.js](https://nodejs.org/) - JavaScript run-time environment

## Screenshots
### Room Search Form and Building Search Results
![](https://i.imgur.com/Q8rCMAR.png)
![](https://i.imgur.com/jAteoyO.png)


### Building Details and Room Details
![](https://i.imgur.com/Zx4uuKC.png)
![](https://i.imgur.com/yHMVNaI.png)

## Development

### Prerequisites
To run this application, you'll need:

- Node.js & npm installed.
- A MongoDB database.
- UW API key.

The MongoDB URI and the UW API keys can be added to your environment variables or can be stored in a keys.js file in ./config
The expected environment variable names are:
- MONGO_URI
- UWATERLOO_API
  
### Getting Started
To get the frontend and backend run locally:

- Clone this repo
- `npm install` to install all back-end required dependencies
- `npm client` to navigate to front-end directory
- `npm install` to install all front-end required dependencies
- `cd ..` to return back to the root directory
- `npm run dev` to start the local server

The front-end will run on port 3000 to prevent conflicts with the backend Express server which runs on port 5000 (customizable using the PORT environment variable).

## Accessing the database API
The application provides an API in order to easily access some of the information stored on the database. The following endpoints are currently implemented: 
- GET /api/buildings
- GET /api/buildings/:code
- GET /api/buildings/:code/rooms
- GET /api/buildings/:code/rooms/:id
- POST /api/search/buildings

More information about the endpoints available as well as examples can be found on the Postman Collection documentation [here](https://documenter.getpostman.com/view/5135212/RWToQdd9)

## Contributing

1. Fork it (<https://github.com/yalshekerchi/StudySpot/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Authors
* **Yasir Al Shekerchi** - *Project Developer* - [yalshekerchi](https://github.com/yalshekerchi)

See also the list of [contributors](https://github.com/yalshekerchi/StudySpot/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

This project contains information provided by the University of Waterloo under license on an 'as is' basis.

## Acknowledgments

* University of Waterloo Open Data team for helping the open source community and providing all the information on their API
* University of Waterloo Campus Map team for their great campus map implementation
