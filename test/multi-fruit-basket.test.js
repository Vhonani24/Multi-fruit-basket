let assert = require("assert");
let TheFruitBasket = require("../multi-fruit-basket");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://vhonani:vhonani123@localhost:5432/multi_fruit_basket_tests';

const pool = new Pool({
    connectionString
});

describe('The fruit_basket function', function () {


    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from fruit_basket_item");
        //await pool.query("ALTER TABLE fruit_basket_item drop column name");

    });



    it('should create a new fruit basket for a given fruit type, qty & fruit price', async function () {

        const testFruitBasket = TheFruitBasket(pool);

        var id = await testFruitBasket.getId();
        var getIdBerries = id[1].id;

        var getIdCitrus = id[0].id;

        var getIdTropical = id[2].id;
        //console.log(getIdCitrus);

        await testFruitBasket.createFruitBasket('strawberries', 5, 5.00, getIdBerries);
        await testFruitBasket.createFruitBasket('oranges', 5, 3.50, getIdCitrus);
        await testFruitBasket.createFruitBasket('mangoes', 3, 2.50, getIdTropical);



        assert.deepEqual([
            {
                "fruit_name": "strawberries",
                "quantity": 5,
                "price": 5.00
            }
        ], await testFruitBasket.findFruitBasket('strawberries'));

    });
    it('should add fruits to an existing basket', async function () {

        const testFruitBasket = TheFruitBasket(pool);

        var id = await testFruitBasket.getId();
        var getIdBerries = id[1].id;

        await testFruitBasket.createFruitBasket('strawberries', 5, 5.00, getIdBerries);

        await testFruitBasket.addFruitToBasket('strawberries', 3);

        assert.deepEqual([
            {
                "fruit_name": "strawberries",
                "quantity": 8,
                "price": 5.00
            }
        ], await testFruitBasket.findFruitBasket('strawberries'));

    });
    it('should remove fruits from an existing basket - if there are no fruit left in the basket the basket should be removed', async function () {

        const testFruitBasket = TheFruitBasket(pool);


        var id = await testFruitBasket.getId();
        var getIdBerries = id[1].id;

        var getIdCitrus = id[0].id;

        await testFruitBasket.createFruitBasket('strawberries', 5, 5.00, getIdBerries);
        await testFruitBasket.createFruitBasket('oranges', 5, 3.50, getIdCitrus);

        await testFruitBasket.removeFruitFromBasket('strawberries', 5);
        await testFruitBasket.removeFruitFromBasket('oranges', 3);




        assert.deepEqual([
            {
                "fruit_name": "oranges",
                "quantity": 2,
                "price": 3.50
            }

        ], await testFruitBasket.findAllFruitBaskets());

    });

    it('for a given id return the basket_name & id as well as a list of all the fruits in the basket', async function () {

        const testFruitBasket = TheFruitBasket(pool);

        var id = await testFruitBasket.getId();

        var getIdBerries = id[1].id;
        var getIdTropical = id[2].id;

        await testFruitBasket.createFruitBasket('strawberries', 5, 5.00, getIdBerries);
        await testFruitBasket.createFruitBasket('bananas', 4, 3.50, getIdTropical);
        await testFruitBasket.createFruitBasket('mangoes', 2, 2.50, getIdTropical);
        await testFruitBasket.createFruitBasket('pineapples', 2, 2.50, getIdTropical);

        //console.log(await testFruitBasket.returnFruitBasketBasedOnId(3))

        assert.deepEqual([
            { name: 'Tropical', id: 3, fruit_name: 'bananas' },
            { name: 'Tropical', id: 3, fruit_name: 'mangoes' },
            { name: 'Tropical', id: 3, fruit_name: 'pineapples' }

        ], await testFruitBasket.returnFruitBasketBasedOnId(3));
    });
    it('should return the total cost of a specific basket based on basket name and on the basket id', async function () {

        const testFruitBasket = TheFruitBasket(pool);

        var id = await testFruitBasket.getId();

        var getIdBerries = id[1].id;
        var getIdTropical = id[2].id;


     

        await testFruitBasket.createFruitBasket('strawberries', 5, 5.00, getIdBerries);
        await testFruitBasket.createFruitBasket('bananas', 4, 3.50, getIdTropical);
        await testFruitBasket.createFruitBasket('mangoes', 2, 2.50, getIdTropical);
        await testFruitBasket.createFruitBasket('pineapples', 2, 2.50, getIdTropical);


        //console.log(await testFruitBasket.totatCostForSpecificBasket('Tropical', 3));


        assert.deepEqual([{ sum: 24.00 }], await testFruitBasket.totatCostForSpecificBasket('Tropical', 3));
    });



    after(function () {
        pool.end();
    })
});