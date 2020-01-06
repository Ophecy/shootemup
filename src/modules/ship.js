class Ship extends Entity {
    constructor(name, maxHealth, maxShield){
        super(name);
        this.maxHealth = maxHealth;
        this.maxShield = maxShield;
    }
}

export default Ship;
