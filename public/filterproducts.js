function filterProductsByBrand() {
    //get the type from the filter dropdown
    var brand_ID = document.getElementById('brand_filter').value
    //construct the URL and redirect to it
    window.location = "/products/filter/" + parseInt(brand_ID)
}
