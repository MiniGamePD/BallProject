//一些时间
const Time_AddNpcToSceneIntervalMax = 200; //ms
const Time_AddNpcToSceneIntervalMin = 70; //ms
const Time_AddNpcToSceneIntervalStep = 10; //ms
const Time_PlayEnemySinisterSmileTime = 500; //ms
const Time_FeverTime = 45000; //ms

//Boss技能
const skillBossMaxNum = 8;

//分辨率参数
const Screen_StanderScreenWidth = 640;
const Screen_StanderScreenHeight = 1136;

//消除相关
const EliminateRoundInMoveUp = 0; // 生成小怪时，上移的消除事件。Round的值
const EliminateRoundStartIndex = 1;
const Eliminate_NextCentainEliminateToolTurn = 10;
const Eliminate_Delay_One_Step = 70; // 每距离一个格子的消除延迟
const Eliminate_Delay_One_Step_CrossEliminater = 55; //  每距离一个格子的消除延迟(特殊消除)
const Eliminate_Delay_One_Step_Boom = 70; //  每距离一个格子的消除延迟(炸弹)

//分数相关
const Score_FeverTimeScale = 2; // FeverTime期间的分数倍率
const Score_EliminateRoundScale = [1, 2, 3, 4, 5]; // 连消的分数倍率
const Score_BaseScore = 60;

//游戏流程相关
const Procedure_ReviveEliminateLine = 5;
const Procedure_InitCreateEnemyLine = 3;
const TurnNum_BossSkillTurnNum = 3;
const TurnNum_CreateEnemyTurnNum = 25;
const TurnNum_CreateSkillBossTurnNum = 5;
const TurnNum_BossSkillTargetNum = 5;

//难度系数
const Difficulty_CreateEnemyTurnNum = [22, 10, 8, 22,   10,   10,   18,  15,  12,  15];
const Difficulty_CreateEnmeyLineNum = [3,  2,  1,  2,    3,    2,    2,   4,   2,   4 ];
const Difficulty_ShieldProperty =     [0.1,  0.1,  0.1,  0.2, 0.2, 0.3, 0.3, 0.35, 0.35, 0.4];
// const Difficulty_CreateEnemyTurnNum = [5, 10, 10];
// const Difficulty_CreateEnmeyLineNum = [1,  2,  3];
// const Difficulty_ShieldProperty =     [0.5,  0,  1];
const Difficulty_MaxDifficulty = 10;
const Difficulty_DropDownSpeedUpTurn1 = 40;
const Difficulty_DropDownSpeedUpTurn2 = 82;
const Difficulty_DropDownSpeedUpTurn3 = 127;
const Difficulty_DropDownSpeedUpTurn4 = 160;
const Difficulty_DropDownSpeedUpStep = 100; //ms
const Difficulty_DropDownMinInterval = 600; //ms
const Difficulty_DropDownMaxInterval = 1000; //ms 


// 动画相关
const Frame_Anim_SceneBoom = ["Boom1", "Boom2"];
const Frame_Anim_SceneBoom_Effect = ["BoomEffect1", "BoomEffect2", "BoomEffect3", "BoomEffect4", "BoomEffect5", 
                                    "BoomEffect6", "BoomEffect7", "BoomEffect8", "BoomEffect9", "BoomEffect10"];

const Frame_Anim_CrossEliminater = ["Cross_huojian1", "Cross_huojian2"];
const Frame_Anim_CrossEliminater_Diretion = ["Cross_zhixiang1", "Cross_zhixiang2", "Cross_zhixiang3"];
const Frame_Anim_CrossEliminater_fashe = ["Cross_fashe1", "Cross_fashe2", "Cross_fashe3", "Cross_fashe4",
                                         "Cross_fashe5", "Cross_fashe6", "Cross_fashe7", "Cross_fashe8", "Cross_fashe9"];
const Frame_Anim_CrossEliminater_tuowei = ["tuowei1", "tuowei2", "tuowei3", "tuowei4", "tuowei5", "tuowei6",
                                             "tuowei7", "tuowei8", "tuowei9", "tuowei10", "tuowei11", "tuowei12"];
const Frame_Anim_Virus_Red_Idle = ["Virus_Red_Idle1", "Virus_Red_Idle1", "Virus_Red_Idle1", "Virus_Red_Idle4", "Virus_Red_Idle5", "Virus_Red_Idle6",
                                             "Virus_Red_Idle6", "Virus_Red_Idle6", "Virus_Red_Idle9", "Virus_Red_Idle10"];
const Frame_Anim_Virus_Blue_Idle = ["Virus_Blue_Idle1", "Virus_Blue_Idle1", "Virus_Blue_Idle1", "Virus_Blue_Idle4", "Virus_Blue_Idle5", "Virus_Blue_Idle6",
                                             "Virus_Blue_Idle6", "Virus_Blue_Idle6", "Virus_Blue_Idle9", "Virus_Blue_Idle10"];
const Frame_Anim_Virus_Yellow_Idle = ["Virus_Yellow_Idle1", "Virus_Yellow_Idle1", "Virus_Yellow_Idle1", "Virus_Yellow_Idle4", "Virus_Yellow_Idle5", "Virus_Yellow_Idle6",
                                             "Virus_Yellow_Idle6", "Virus_Yellow_Idle6", "Virus_Yellow_Idle9", "Virus_Yellow_Idle10"];
const Frame_Anim_Virus_Red_Fever = ["Virus_Red_Fever1", "Virus_Red_Fever2", "Virus_Red_Fever3", "Virus_Red_Fever4"];
const Frame_Anim_Virus_Blue_Fever = ["Virus_Blue_Fever1", "Virus_Blue_Fever2", "Virus_Blue_Fever3", "Virus_Blue_Fever4"];
const Frame_Anim_Virus_Yellow_Fever = ["Virus_Yellow_Fever1", "Virus_Yellow_Fever2", "Virus_Yellow_Fever3", "Virus_Yellow_Fever4"];

const Frame_Anim_Pill_Land_Effect = ["LuoDi_00000", "LuoDi_00001", "LuoDi_00002", "LuoDi_00003", 
                                "LuoDi_00004", "LuoDi_00005", "LuoDi_00006", "LuoDi_00007", "LuoDi_00008", "LuoDi_00009", "LuoDi_00010"];
const Frame_Anim_Pill_Boom_Effect = ["Pill_Boom_01", "Pill_Boom_02", "Pill_Boom_03", "Pill_Boom_04", "Pill_Boom_05", "Pill_Boom_06"];           