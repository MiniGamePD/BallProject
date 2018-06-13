class GameplayElementFactory
{
    public CreateGameplayElement<T extends GameplayElementBase>(c: {new(): T; }):T
    { 
        return new c();
    }
}