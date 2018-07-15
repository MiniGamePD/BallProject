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

    var NowDate = new Date();
    
    console.log("Now date: " + NowDate);

    NowDate.setMinutes(0);
    NowDate.setHours(0);
    NowDate.setSeconds(0);
    console.log("Now date: " + NowDate);
    
    return Math.floor(NowDate.getTime() / 1000);

    //return 10000000000000;
}



};