Ascii Warehouse
====

This is an ecommerce site, where you can buy all sorts of ascii faces like `(ノ・∀・)ノ` and `¯_(ツ)_/¯`, in a wide variety of font sizes.

## Features
----

- products are displayed in a grid.
- user has an option to sort the products in ascending order. Can sort by "size", "price" or "id".
- each product has:
  - a "size" field, which is the font-size (in pixels). The faces are displayed in their correct size, to give customers a realistic impression of what they're buying.
  - a "price" field, in cents. Formatted as dollars like `$3.51`.
  - a "date" field, which is the date the product was added to the catalog. Dates is displayed in relative time (eg. "3 days ago") unless they are older than 1 week, in which case the full date is displayed.
- the product grid automatically load more items as you scroll down.
- our product database is under high load due to growing demand for ascii, so an animated "loading..." message is displayed while the user waits.
- to improve the user's experience, we always pre-emptively fetch the next batch of results in advance, making use of idle-time.  But they still are not displayed until the user has scrolled to the bottom of the product grid.
- when the user reaches the end and there are no more products to display, the message "~ end of catalogue ~" is displayed.

### Ads features

- after every 20 products an advertisement is inserted from one of our sponsors.
- Ads should be randomly selected, but a user never sees the same ad twice in a row.


### Products API
----

- The basic query looks like this: `/api/products`
- The response format is newline-delimited JSON.
- To get a larger results set use the `limit` parameter, eg: `/api/products?limit=100`
- To paginate results use the `skip` parameter, eg: `/api/products?limit=15&skip=30` (returns 15 results starting from the 30th).
- To sort results use the `sort` parameter, eg: `/api/products?sort=price`. Valid sort values are `price`, `size` and `id`.


## SOLUTION

- `ascii-warehouse.product-catalogue` module:
        It's the principal module built to handle all features related to Product. It contains one factory service, `ProductCatalogue` and one controller `ProductCatalogueCtrl`. The service `ProductCatalogue` returns a prototype for ProductCatalogue objects representing the catalogue of products responsible not only for managing the loading of products (with pre-emptively fetch the next batch of results in advance), but also for its state. All the component logic is handle by this object. This solution was adopted so on each injection it will create a new ProductCatalogue object making it possible to have multiple ProductCatalogue components independents (without sharing datas). The controller `ProductCatalogueCtrl` only serves the view with specific model data and behavior functions to build the catalogue of products.
- `ascii-warehouse.product-catalogue.widget` module:
        It's the module containing the directive for presenting the catalogue of products with features like infinite-scroll, advertisement after every 20 products, human date and loading animation.
- `ascii-warehouse.advertisement.widget` module:
        It's the module containing the directive for inserting an randomly advertisement from one of our sponsors and never the same twice in a row.
- `widget.humanize-date` module:
        It's the module containing the filter to display the product date in relative time or full date.
- `widget.notification` module:
        It's the module containing the directive to present a notification. It's used to show the message "loading..." and "~ end of catalogue ~".


## Running the app
### Install
Install project dependencies
```sh
$ npm install
```
```sh
$ bower install
```
### Build
Build the project
```sh
$ grunt
```
### Run
Then start the server
```sh
$ npm start
```
