class CTimeHelper
{
public static Now() : number
{
    return Math.floor(new Date().getTime()/1000);
}

public static IsNewDay(timestamp: number): boolean
{
    return this.BeginTimeOfToday() > timestamp;
}

public static BeginTimeOfToday() : number
{
    
    return 10000000000000;
}

};