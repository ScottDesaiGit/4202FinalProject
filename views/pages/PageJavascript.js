//Finding a product by id
function findById(product){
    window.location = `/products/${product}`;
}

function findByOrderId(order){
    window.location = `/orders/${order}`;
}

function viewReviews(product){
    window.location = `/reviews/${product}`;
}

function viewOrders(){
    window.location = `/orders`;
}

//Finding a product by name
function findByProductName(){
    let productName = document.getElementById("productName").value
    if($("#allProducts").is(":checked")){
        window.location = `/products?name=${productName}&inStock=0`
    }else{
        window.location = `/products?name=${productName}&inStock=1`
    }
}

function reviewProduct(product){
    let rating = $('#productRating').val()
    console.log(rating)
    let isNum = /^\d+$/.test(rating);
    if(isNum){  
        if((0 < rating)&&(rating <= 10)){
            reviewData = {rating: rating};
            axios({
                method: 'post',
                url: '/reviews/' + product,
                data: reviewData
            })
            .then(reponse => {
                window.location.reload()
            }).catch(function(error){
                console.log(error);
            });        
        }else{
            console.log("Incorrect Input");
            alert("Need a rating between 1 and 10");
        }
    }else{
        console.log("Incorrect Input");
        alert("The rating entered must be a number");
    }
}
