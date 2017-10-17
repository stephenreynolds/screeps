export abstract class AbstractTask
{
    public abstract Initialize(): void;
    public abstract CheckCreeps(): void;
    public abstract Run(): void;
    public abstract Finalize(): void;
}
