export class Block
{
    constructor(type, data)
    {
        this.type = type;
        this.data = data;
    }
}

export class Line extends Block
{
    constructor()
    {
        super("Line", "│   ");
    }
}

export class Fork extends Block
{
    constructor()
    {
        super("Fork", "├── ");
    }
}

export class Bend extends Block
{
    constructor()
    {
        super("Bend", "└── ");
    }
}

export class Gap extends Block
{
    constructor()
    {
        super("Gap", "    ");
    }
}

export class Data extends Block
{
    constructor(data)
    {
        super("Data", data);
    }
}

export class New extends Block
{
    constructor()
    {
        super("???", "____");
    }
}

export class End extends Block
{
    constructor()
    {
        super("End", "\n");
    }
}

export class Null extends Block
{
    constructor()
    {
        super("Null", null);
    }
}