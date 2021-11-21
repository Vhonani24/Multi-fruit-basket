module.exports = function MultiFruitBasket(pool) {


    async function findFruitBasket(fruit) {
        const result = await pool.query('select fruit_name,quantity,price from fruit_basket_item where fruit_name = $1', [fruit]);

        return result.rows;


    }

    async function findAllFruitBaskets() {
        const result = await pool.query('select fruit_name,quantity,price from fruit_basket_item');

        return result.rows;


    }

    async function returnFruitBasketBasedOnId(id) {


        const result = await pool.query('select multi_fruit_basket.name,multi_fruit_basket.id,fruit_basket_item.fruit_name from  multi_fruit_basket INNER JOIN fruit_basket_item ON multi_fruit_basket.id = fruit_basket_item.basket_id where basket_id = $1', [id]);

        return result.rows;

    }

    async function totatCostForSpecificBasket(name,id) {

        //const alter = await pool.query("ALTER table fruit_basket_item ADD COLUMN name text");


        const result = await pool.query("UPDATE fruit_basket_item SET name = $1 where basket_id = $2",[name,id]);


        const result2 = await pool.query('SELECT SUM(price*quantity) FROM fruit_basket_item WHERE name = $1',[name]);



        

        return result2.rows;


    }

    async function createFruitBasket(fruitName, quantity, price, id) {

        await pool.query("INSERT INTO fruit_basket_item(fruit_name,quantity,price,basket_id) values($1,$2,$3,$4)", [fruitName, quantity, price, id])

    }

    async function getId() {
        const result = await pool.query('select * from multi_fruit_basket');
        const rowResults = result.rows;
        return rowResults;
    }
    
    async function addFruitToBasket(fruit, qty) {

        var result = await pool.query("UPDATE fruit_basket_item SET quantity = quantity + $2 where fruit_name = $1", [fruit, qty]);

    }
    async function removeFruitFromBasket(fruit, qty) {


        var result = await pool.query("UPDATE fruit_basket_item SET quantity = quantity - $2 where fruit_name = $1", [fruit, qty]);

        var result2 = await pool.query("DELETE FROM fruit_basket_item where quantity < 1");


    }




    return {
        createFruitBasket,
        findAllFruitBaskets,
        getId,
        addFruitToBasket,
        removeFruitFromBasket,
        findFruitBasket,
        returnFruitBasketBasedOnId,
        totatCostForSpecificBasket

    }


}