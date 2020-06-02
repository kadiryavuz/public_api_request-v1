# public_api_request-v1
Asynchronous Programming with JavaScript using VanillaJS, FetchAPI and Promises (FSJT-5)

* Gathers and displays a random 12 user with us and gb nationals data from randomuser.me - FetchAPI
* Async approach using PromiseAPI
* Extra features 
    * allows search with a search form on right-top - to filter list  - with user names only (lastname not included)
    * allows toggling back and forth between employees when the modal window is open. 
        * also available with filtered data upon search action 
            * last item on the list renders to next button disabled and styles applied
            * first item on the list is rendered with prev button disabled and stypes applied
            * if only one item is displayed on the list, then modal does not display the button field of modal window at all
    * extra styles
        * font changed to Manrope
        * Modal window prev and next button disabled styles - disabledButton
        * during the action of toggling back and forth via modal buttons, in the galery view, switched card becomes activated with the border styling - selectedCard
