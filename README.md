# Yelpcamp

A fun MERN stack project that I spent way too much time on.

This website allows users to browse available campgrounds that are created by others, book them for certain dates and also leave reviews. A user can freely browse and explore what's available, but to book or create their own campground, they must regsiter. Users can also see all their created campgrounds, bookings and reviews in the profile page. Has both Light and Dark theme! (toooo much CSS involved)

### Live link of website yelpcamp: http://yelpcamp.zapto.org

### Technologies used:

- Redis hosted on upstash for caching campgrounds and paginated campgrounds.
- MongoDB Atlas.
- MapBox using location pickers and a Clustermap to show all available campgrounds.
- Cloudinary to store images.
- Vite
- Express.
- PassportJS.

### How to run it locally:

**Note:** This project has been run and tested only on Node 18.17.0, I'm not sure how well other versions will work.

Install node.js.

Install and run docker engine.

run "docker compose up" to create a mongodb and redis instance.

```sh
docker compose up
```

"npm run dev" to run vite.

```sh
npm run dev
```

"npm run server" to run the express server.

```sh
npm run server
```

When starting up the server, all campground, review and booking data will be deleted. After that, campground data will be automatically seeded (default set to 80 campgrounds, can be changed in ./server/express.ts under the variable seedAmount)

Furthermore, every seeded campground has an "Author" attached (creator of the campground) which is simply a user's mongodb \_id that is created after registering (note that users never get deleted). I would recommend creating a user for the sole purpose of at least owning the seeded campgrounds for a better overall experience.

Add the \_id of the user in ./server/repositories/campgrounds.ts under the function seedCampgrounds() in the "author" field

In hindsight, I really should have a dummy user that gets created who owns the seeds...

### Environmental variables

To get this project running properly, you must create a Cloudinary and MapBox account.

### Cloudinary
A cloudinary account can be made here: https://cloudinary.com/users/register_free

After creating an account, you will need 3 pieces of information.

- Cloud name
- API Key
- API Secret

All of these can be obtained from your cloudinary account dashboard. 

### MapBox
A MapBox account can be created here: https://www.mapbox.com

**NOTE:** You will need to attach a credit card to your MapBox account to use it. You will have up to 50,000 free Map Loads/month before you get charged. However in this project, I never got close to 4,000 loads despite refreshing like a madman.

After creating the account, all you will need is the **"Default public Token"**

### .env file
With that, add the cloud name, api key, api secret and the mapbox public token into the .env.example file. After that, rename the .env.example file into ".env"

REDIS_URL and DB_URL can remain untouched if you're running the project locally with docker. If you wish to host your own mongo database or redis server, simply add the url to their respective environmental variable.


### TODO List:

The project isn't perfect and definetly has bugs (aesthetic mainly), I'll note down some of them below and if I feel like jumping back to this project, I'll consider tackling them or maybe add more features on top of what I already have.

### Fixes/Changes

- Use different star collection (starbility bug where whichever rating the user clicks on (1-5), the correct rating is selected but visually it always shows that "5" is selected). Maybe use React-Stars...?

- Limiting the amount of files that can be uploaded at once, and the total amount of images that can be uploaded for one campground.

- Adding a limit on the file sizes (10MB max maybe?)

- When a user is selecting and highlighting a field in the login/register form, if they click up while outside the form, the form closes. This should not be the case.

Overall a great and fun learning experience where my downfall was the urge to keep adding more features until it got a little bit out of hand. But in retrospect, I've learned a lot and would be down to jump into more rabbit holes than I never knew existed. Also to stress test my sanity.