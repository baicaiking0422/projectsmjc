## Topic:<br />
We will implement a second hand shopping website for shoes and clothes, where users can sell and purchase items. This website serves people who like to on-line shop for second hand clothes, and/or sell items they own. All data are stored using MongoDB, and the type of data are users and products.<br />

## Users Attributes:<br />
1. In terms of user authentication and authorization, the user can choose to login or sign in to the website.<br />

2. For each user, he/she owns their profile page, which is a personal information page. Users can edit their personal information, upload items for sale, view purchase and sale history, view items they are currently selling, check balance of wallet, rate products they already bought and view messages sent from other users.<br />

3. Search for items in a search bar using key words.<br />

4. User can use a filter to select the price range and the size of the items. (we might add other features for the filter)<br />

5. The user can also navigate the database of items by category in side bar(dress, pants, shorts, skirts, etc.).<br />

6. When the user find an item they would like to purchase, they can click the purchase button; this transaction is only possible if the buyer has enough money. (We may also consider design credit card payment).<br />

7. Some users are both buyer and seller. As a seller, user can also seller their second hand items on-line by uploading a picture or pictures as they like, and they have to enter a price and add a description (such as adding size and category tags) for the product.<br />

8. Users can only add comments and give ratings to the products they already purchased.<br />

9. Users can also contact with other users who are sellers. There is a chat option where sellers and buyers can on-line chat with each other.<br />

10. Items can only be purchased if the buyer has logged in to his/her account. In other words, everyone can view the clothing website, however, the purchase option is only available to people with actual accounts.<br />

## Admin Attributes:<br />
1. Admins can change personal information and password of all users but normal users can only change their own profile information.<br />

2. Functions of Admin are deleting, adding and updating users and their information; and repopulating the database by uploading items for sale.<br />

3. Admins also have a management page. In this page, admins have the options to add, remove, edit and show all users and products information.<br />