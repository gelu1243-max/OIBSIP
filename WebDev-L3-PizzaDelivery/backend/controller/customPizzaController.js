import {prisma} from "../config/db.js"
//create custom pizza
export const createCustomPizza = async (req, res) =>{
    try{
        const userId=req.user.id;
        console.log(req.user);
        console.log(userId);
        const {name,baseId,sauceId,cheeseId, vegetableIds} = req.body;
        if(!baseId || !sauceId || !cheeseId || !vegetableIds?.length){
            return res.status(400).json({
                message: "Base, sauce, cheese, and at least one vegetable are required to create a custom pizza."});
        }
        const base = await prisma.pizzaBase.findUnique({where:{id:baseId}});
        const sauce = await prisma.sauce.findUnique({where:{id:sauceId}});
        const cheese = await prisma.cheese.findUnique({where:{id:cheeseId}});
        const vegetables = await prisma.vegetable.findMany({where:{id:{in:vegetableIds.map((id)=>Number(id))}}});
        if (!base || !sauce || !cheese || vegetables.length==0) {
            return res.status(400).json({
                message: "One or more selected ingredients are were not found."});
        }
        // generae description
        const vegetableNames = vegetables.map((veg) => veg.name).join(", ");
        const description =`A delicious custom pizza with ${base.name} base, ${sauce.name} sauce, ${cheese.name} cheese, and topped with ${vegetableNames}.`;
        //calculate total price
        const vegtablePrice = vegetables.reduce((total, veg) => total + veg.price, 0);
        const totalPrice = base.price + sauce.price + cheese.price + vegtablePrice;
        //create custom pizza
        const customPizza = await prisma.customPizza.create({
            data:{
                userId,
                name,
                description,
                price: totalPrice,
                baseId: Number(baseId),
                sauceId: Number(sauceId),
                cheeseId: Number(cheeseId),
                vegetables: { connect: vegetableIds.map((id) => ({ id: Number(id) })) }
            },
            include: {
                base: true,
                sauce: true,
                cheese: true,
                vegetables: true
            },
        });
        res.status(201).json(customPizza);
    } catch (error) {
        console.error("Error creating custom pizza:", error);
        res.status(500).json({error: "Internal server error"});
    }
}
//get all custom pizzas

export const getAllCustomPizzas = async (req, res) => {
  try {
    const customPizzas = await prisma.customPizza.findMany({
      include: {
        user: true,
        base: true,
        sauce: true,
        cheese: true,
        vegetables: true,
      },
    });

    res.status(200).json(customPizzas);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//get custom pizza by id
export const getCustomPizzaById = async (req, res) => {
  try {
    const { id } = req.params;
    const customPizza = await prisma.customPizza.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        base: true,
        sauce: true,
        cheese: true,
        vegetables: true,
      },
    });
    if (!customPizza) {
      return res.status(404).json({ message: "Custom pizza not found" });
    }
    res.status(200).json(customPizza);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// delete custom pizza by id
export const deleteCustomPizza = async (req, res) => {
    try{
        const { id } = req.params;
        const customPizza = await prisma.customPizza.findUnique({where:{id:Number(id)}});
        if(!customPizza){
            return res.status(404).json({message:"Custom pizza not found"});
        }
        await prisma.customPizza.delete({where:{id:Number(id)}});
        res.status(200).json({message:"Custom pizza deleted successfully"});   
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});  
    
    }
}