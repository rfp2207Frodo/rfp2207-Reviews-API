const db = require('../db.js');

module.exports = {
  get: async(product_id, sort, page, count) => {
    let sortQuery;
    switch (sort) {
      case 'newest':
        sortQuery = `ORDER BY id`;
        break;
      case 'helpful':
        sortQuery = `ORDER BY helpfulness`;
        break;
      case 'relevant':
        sortQuery = `ORDER BY helpfulness`; //placeholder sort, figure out actual sorting mechanism here
        break;
    }

    const mapPhotos = (review) => {
      let queryPhotos = `SELECT id, url FROM review_photo WHERE review_id = ${review.id} LIMIT 5`

      return db
      .query(queryPhotos)
      .then((res) => {
        let date = new Date(0);
        date.setUTCSeconds(parseInt(review.date));
        review.date = date;
        return review.photos = res.rows;
      })
      .catch((err) => console.log(err));
    };

    let queryReviews =
    `SELECT * FROM review WHERE product_id = ${product_id} AND reported = false
    ${sortQuery}
    OFFSET ${(page - 1) * count} LIMIT ${count}`;

    const client = await db.connect();
    let results = await client
      .query(queryReviews)
      .then(async(res) => {
        await Promise.all(res.rows.map(mapPhotos));
        client.release();
        return res.rows;
      })
      .catch((err) => {
        client.release();
        console.log(err);
      })

    return {
      'product': product_id.toString(),
      'page': page - 1,
      'count': count,
      'results': results
    };
  },

  getMetadata: async() => {

  },

  post: async() => {

  },

  updateHelpful: async() => {

  },

  updateReport: async() => {

  }
};



/*
var utcSeconds = 1234567890;
var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
d.setUTCSeconds(utcSeconds);
*/


//get reviews

/*
page	      integer	  Selects the page of results to return. Default 1.
  OFFSET (multiply page by count, page will start at 0 (page - 1))
count	      integer	  Specifies how many results per page to return. Default 5.
  LIMIT
sort	      text	    Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"  <-- default to newest if not specified?
    newest -> order by id? date?
    helpful -> order by helpfulness
    relevant -> order by helpfulness with some weight on id/date?
product_id	integer 	Specifies the product for which to retrieve reviews.
*/

/*
{
  "product": "2",
  "page": 0,
  "count": 5,                     <------------- Make sure to return these three properties
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",                              <---------- Transform date to this format (or maybe a more readable one since frontend allows)
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"          <---------- Attach array of photos to each result
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
}
*/

//get review metadata for a product

/*
product_id	integer	Required ID of the product for which data should be returned
*/

/*
{
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    4: 2,
    // ...
  },
  "recommended": {
    0: 5
    // ...
  },
  "characteristics": {
    "Size": {
      "id": 14,            <------------- Grab characteristic id (product characteristic, not review characteristic)
      "value": "4.0000"    <------------- Calculate average
    },
    "Width": {
      "id": 15,
      "value": "3.5000"
    },
    "Comfort": {
      "id": 16,
      "value": "4.0000"
    },
    // ...
}
*/

//post a review

//update helpful review

//report review