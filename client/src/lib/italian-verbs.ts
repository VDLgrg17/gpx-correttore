
// Lista dei 100 verbi italiani più frequenti con le loro coniugazioni principali.
// Include: Indicativo (Presente, Imperfetto, Passato Remoto, Futuro), 
// Congiuntivo (Presente, Imperfetto), Condizionale, Imperativo, Participio, Gerundio.

export const COMMON_VERBS = new Set([
  // ESSERE
  'essere', 'sono', 'sei', 'è', 'siamo', 'siete', 'ero', 'eri', 'era', 'eravamo', 'eravate', 'erano',
  'fui', 'fosti', 'fu', 'fummo', 'foste', 'furono', 'sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno',
  'sia', 'siano', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero',
  'sarei', 'saresti', 'sarebbe', 'saremmo', 'sareste', 'sarebbero',
  'sii', 'siate', 'stato', 'stata', 'stati', 'state', 'essendo',

  // FORME ENCLITICHE RADDOPPIATE COMUNI
  'dammi', 'fammi', 'dimmi', 'stammi', 'vacci', 'dacci', 'facci', 'dicci', 'dalle', 'falle', 'dille',

  // AVERE
  'avere', 'ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno', 'avevo', 'avevi', 'aveva', 'avevamo', 'avevate', 'avevano',
  'ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero', 'avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno',
  'abbia', 'abbiano', 'avessi', 'avesse', 'avessimo', 'aveste', 'avessero',
  'avrei', 'avresti', 'avrebbe', 'avremmo', 'avreste', 'avrebbero',
  'abbi', 'abbiate', 'avuto', 'avuta', 'avuti', 'avute', 'avendo',

  // ANDARE
  'andare', 'vado', 'vai', 'va', 'andiamo', 'andate', 'vanno', 'andavo', 'andavi', 'andava', 'andavamo', 'andavate', 'andavano',
  'andai', 'andasti', 'andò', 'andammo', 'andaste', 'andarono', 'andrò', 'andrai', 'andrà', 'andremo', 'andrete', 'andranno',
  'vada', 'vadano', 'andassi', 'andasse', 'andassimo', 'andaste', 'andassero',
  'andrei', 'andresti', 'andrebbe', 'andremmo', 'andreste', 'andrebbero',
  'vacci', 'andateci', 'andato', 'andata', 'andati', 'andate', 'andando',

  // FARE
  'fare', 'faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno', 'facevo', 'facevi', 'faceva', 'facevamo', 'facevate', 'facevano',
  'feci', 'facesti', 'fece', 'facemmo', 'faceste', 'fecero', 'farò', 'farai', 'farà', 'faremo', 'farete', 'faranno',
  'faccia', 'facciano', 'facessi', 'facesse', 'facessimo', 'faceste', 'facessero',
  'farei', 'faresti', 'farebbe', 'faremmo', 'fareste', 'farebbero',
  'fammi', 'fatemi', 'fatto', 'fatta', 'fatti', 'fatte', 'facendo',

  // DIRE
  'dire', 'dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono', 'dicevo', 'dicevi', 'diceva', 'dicevamo', 'dicevate', 'dicevano',
  'dissi', 'dicesti', 'disse', 'dicemmo', 'diceste', 'dissero', 'dirò', 'dirai', 'dirà', 'diremo', 'direte', 'diranno',
  'dica', 'dicano', 'dicessi', 'dicesse', 'dicessimo', 'diceste', 'dicessero',
  'direi', 'diresti', 'direbbe', 'diremmo', 'direste', 'direbbero',
  'dimmi', 'ditemi', 'detto', 'detta', 'detti', 'dette', 'dicendo',

  // POTERE
  'potere', 'posso', 'puoi', 'può', 'possiamo', 'potete', 'possono', 'potevo', 'potevi', 'poteva', 'potevamo', 'potevate', 'potevano',
  'potei', 'potesti', 'poté', 'potemmo', 'poteste', 'poterono', 'potrò', 'potrai', 'potrà', 'potremo', 'potrete', 'potranno',
  'possa', 'possano', 'potessi', 'potesse', 'potessimo', 'poteste', 'potessero',
  'potrei', 'potresti', 'potrebbe', 'potremmo', 'potreste', 'potrebbero',
  'potuto', 'potendo',

  // VOLERE
  'volere', 'voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono', 'volevo', 'volevi', 'voleva', 'volevamo', 'volevate', 'volevano',
  'volli', 'volesti', 'volle', 'volemmo', 'voleste', 'vollero', 'vorrò', 'vorrai', 'vorrà', 'vorremo', 'vorrete', 'vorranno',
  'voglia', 'vogliano', 'volessi', 'volesse', 'volessimo', 'voleste', 'volessero',
  'vorrei', 'vorresti', 'vorrebbe', 'vorremmo', 'vorreste', 'vorrebbero',
  'voluto', 'volendo',

  // DOVERE
  'dovere', 'devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono', 'dovevo', 'dovevi', 'doveva', 'dovevamo', 'dovevate', 'dovevano',
  'dovei', 'dovesti', 'dovette', 'dovemmo', 'doveste', 'dovettero', 'dovrò', 'dovrai', 'dovrà', 'dovremo', 'dovrete', 'dovranno',
  'debba', 'debbano', 'dovessi', 'dovesse', 'dovessimo', 'doveste', 'dovessero',
  'dovrei', 'dovresti', 'dovrebbe', 'dovremmo', 'dovreste', 'dovrebbero',
  'dovuto', 'dovendo',

  // SAPERE
  'sapere', 'so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno', 'sapevo', 'sapevi', 'sapeva', 'sapevamo', 'sapevate', 'sapevano',
  'seppi', 'sapesti', 'seppe', 'sapemmo', 'sapeste', 'seppero', 'saprò', 'saprai', 'saprà', 'sapremo', 'saprete', 'sapranno',
  'sappia', 'sappiano', 'sapessi', 'sapesse', 'sapessimo', 'sapeste', 'sapessero',
  'saprei', 'sapresti', 'saprebbe', 'sapremmo', 'sapreste', 'saprebbero',
  'sappi', 'sappiate', 'saputo', 'sapendo',

  // STARE
  'stare', 'sto', 'stai', 'sta', 'stiamo', 'state', 'stanno', 'stavo', 'stavi', 'stava', 'stavamo', 'stavate', 'stavano',
  'stetti', 'stesti', 'stette', 'stemmo', 'steste', 'stettero', 'starò', 'starai', 'starà', 'staremo', 'starete', 'staranno',
  'stia', 'stiano', 'stessi', 'stesse', 'stessimo', 'steste', 'stessero',
  'starei', 'staresti', 'starebbe', 'staremmo', 'stareste', 'starebbero',
  'stacci', 'stateci', 'stato', 'stata', 'stati', 'state', 'stando',

  // VEDERE
  'vedere', 'vedo', 'vedi', 'vede', 'vediamo', 'vedete', 'vedono', 'vedevo', 'vedevi', 'vedeva', 'vedevamo', 'vedevate', 'vedevano',
  'vidi', 'vedesti', 'vide', 'vedemmo', 'vedeste', 'videro', 'vedrò', 'vedrai', 'vedrà', 'vedremo', 'vedrete', 'vedranno',
  'veda', 'vedano', 'vedessi', 'vedesse', 'vedessimo', 'vedeste', 'vedessero',
  'vedrei', 'vedresti', 'vedrebbe', 'vedremmo', 'vedreste', 'vedrebbero',
  'visto', 'vista', 'visti', 'viste', 'vedendo',

  // SENTIRE
  'sentire', 'sento', 'senti', 'sente', 'sentiamo', 'sentite', 'sentono', 'sentivo', 'sentivi', 'sentiva', 'sentivamo', 'sentivate', 'sentivano',
  'sentii', 'sentisti', 'sentì', 'sentimmo', 'sentiste', 'sentirono', 'sentirò', 'sentirai', 'sentirà', 'sentiremo', 'sentirete', 'sentiranno',
  'senta', 'sentano', 'sentissi', 'sentisse', 'sentissimo', 'sentiste', 'sentissero',
  'sentirei', 'sentiresti', 'sentirebbe', 'sentiremmo', 'sentireste', 'sentirebbero',
  'sentito', 'sentita', 'sentiti', 'sentite', 'sentendo',

  // PARLARE
  'parlare', 'parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano', 'parlavo', 'parlavi', 'parlava', 'parlavamo', 'parlavate', 'parlavano',
  'parlai', 'parlasti', 'parlò', 'parlammo', 'parlaste', 'parlarono', 'parlerò', 'parlerai', 'parlerà', 'parleremo', 'parlerete', 'parleranno',
  'parli', 'parlino', 'parlassi', 'parlasse', 'parlassimo', 'parlaste', 'parlassero',
  'parlerei', 'parleresti', 'parlerebbe', 'parleremmo', 'parlereste', 'parlerebbero',
  'parlato', 'parlata', 'parlati', 'parlate', 'parlando',

  // MANGIARE
  'mangiare', 'mangio', 'mangi', 'mangia', 'mangiamo', 'mangiate', 'mangiano', 'mangiavo', 'mangiavi', 'mangiava', 'mangiavamo', 'mangiavate', 'mangiavano',
  'mangiai', 'mangiasti', 'mangiò', 'mangiammo', 'mangiaste', 'mangiarono', 'mangerò', 'mangerai', 'mangerà', 'mangeremo', 'mangerete', 'mangeranno',
  'mangi', 'mangino', 'mangiassi', 'mangiasse', 'mangiassimo', 'mangiaste', 'mangiassero',
  'mangerei', 'mangeresti', 'mangerebbe', 'mangeremmo', 'mangereste', 'mangerebbero',
  'mangiato', 'mangiata', 'mangiati', 'mangiate', 'mangiando',

  // DORMIRE
  'dormire', 'dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono', 'dormivo', 'dormivi', 'dormiva', 'dormivamo', 'dormivate', 'dormivano',
  'dormii', 'dormisti', 'dormì', 'dormimmo', 'dormiste', 'dormirono', 'dormirò', 'dormirai', 'dormirà', 'dormiremo', 'dormirete', 'dormiranno',
  'dorma', 'dormano', 'dormissi', 'dormisse', 'dormissimo', 'dormiste', 'dormissero',
  'dormirei', 'dormiresti', 'dormirebbe', 'dormiremmo', 'dormireste', 'dormirebbero',
  'dormito', 'dormita', 'dormiti', 'dormite', 'dormendo',

  // PRENDERE
  'prendere', 'prendo', 'prendi', 'prende', 'prendiamo', 'prendete', 'prendono', 'prendevo', 'prendevi', 'prendeva', 'prendevamo', 'prendevate', 'prendevano',
  'presi', 'prendesti', 'prese', 'prendemmo', 'prendeste', 'presero', 'prenderò', 'prenderai', 'prenderà', 'prenderemo', 'prenderete', 'prenderanno',
  'prenda', 'prendano', 'prendessi', 'prendesse', 'prendessimo', 'prendeste', 'prendessero',
  'prenderei', 'prenderesti', 'prenderebbe', 'prenderemmo', 'prendereste', 'prenderebbero',
  'preso', 'presa', 'presi', 'prese', 'prendendo',

  // DARE
  'dare', 'do', 'dai', 'dà', 'diamo', 'date', 'danno', 'davo', 'davi', 'dava', 'davamo', 'davate', 'davano',
  'diedi', 'desti', 'diede', 'demmo', 'deste', 'diedero', 'darò', 'darai', 'darà', 'daremo', 'darete', 'daranno',
  'dia', 'diano', 'dessi', 'desse', 'dessimo', 'deste', 'dessero',
  'darei', 'daresti', 'darebbe', 'daremmo', 'dareste', 'darebbero',
  'dato', 'data', 'dati', 'date', 'dando',

  // VENIRE
  'venire', 'vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono', 'venivo', 'venivi', 'veniva', 'venivamo', 'venivate', 'venivano',
  'venni', 'venisti', 'venne', 'venimmo', 'veniste', 'vennero', 'verrò', 'verrai', 'verrà', 'verremo', 'verrete', 'verranno',
  'venga', 'vengano', 'venissi', 'venisse', 'venissimo', 'veniste', 'venissero',
  'verrei', 'verresti', 'verrebbe', 'verremmo', 'verreste', 'verrebbero',
  'venuto', 'venuta', 'venuti', 'venute', 'venendo',

  // CAPIRE
  'capire', 'capisco', 'capisci', 'capisce', 'capiamo', 'capite', 'capiscono', 'capivo', 'capivi', 'capiva', 'capivamo', 'capivate', 'capivano',
  'capii', 'capisti', 'capì', 'capimmo', 'capiste', 'capirono', 'capirò', 'capirai', 'capirà', 'capiremo', 'capirete', 'capiranno',
  'capisca', 'capiscano', 'capissi', 'capisse', 'capissimo', 'capiste', 'capissero',
  'capirei', 'capiresti', 'capirebbe', 'capiremmo', 'capireste', 'capirebbero',
  'capito', 'capita', 'capiti', 'capite', 'capendo',

  // CHIEDERE
  'chiedere', 'chiedo', 'chiedi', 'chiede', 'chiediamo', 'chiedete', 'chiedono', 'chiedevo', 'chiedevi', 'chiedeva', 'chiedevamo', 'chiedevate', 'chiedevano',
  'chiesi', 'chiedesti', 'chiese', 'chiedemmo', 'chiedeste', 'chiesero', 'chiederò', 'chiederai', 'chiederà', 'chiederemo', 'chiederete', 'chiederanno',
  'chieda', 'chiedano', 'chiedessi', 'chiedesse', 'chiedessimo', 'chiedeste', 'chiedessero',
  'chiederei', 'chiederesti', 'chiederebbe', 'chiederemmo', 'chiedereste', 'chiederebbero',
  'chiesto', 'chiesta', 'chiesti', 'chieste', 'chiedendo',

  // CERCARE
  'cercare', 'cerco', 'cerchi', 'cerca', 'cerchiamo', 'cercate', 'cercano', 'cercavo', 'cercavi', 'cercava', 'cercavamo', 'cercavate', 'cercavano',
  'cercai', 'cercasti', 'cercò', 'cercammo', 'cercaste', 'cercarono', 'cercherò', 'cercherai', 'cercherà', 'cercheremo', 'cercherete', 'cercheranno',
  'cerchi', 'cerchino', 'cercassi', 'cercasse', 'cercassimo', 'cercaste', 'cercassero',
  'cercherei', 'cercheresti', 'cercherebbe', 'cercheremmo', 'cerchereste', 'cercherebbero',
  'cercato', 'cercata', 'cercati', 'cercate', 'cercando',

  // LASCIARE
  'lasciare', 'lascio', 'lasci', 'lascia', 'lasciamo', 'lasciate', 'lasciano', 'lasciavo', 'lasciavi', 'lasciava', 'lasciavamo', 'lasciavate', 'lasciavano',
  'lasciai', 'lasciasti', 'lasciò', 'lasciammo', 'lasciaste', 'lasciarono', 'lascerò', 'lascerai', 'lascerà', 'lasceremo', 'lascerete', 'lasceranno',
  'lasci', 'lascino', 'lasciassi', 'lasciasse', 'lasciassimo', 'lasciaste', 'lasciassero',
  'lascerei', 'lasceresti', 'lascerebbe', 'lasceremmo', 'lascereste', 'lascerebbero',
  'lasciato', 'lasciata', 'lasciati', 'lasciate', 'lasciando',

  // ENTRARE
  'entrare', 'entro', 'entri', 'entra', 'entriamo', 'entrate', 'entrano', 'entravo', 'entravi', 'entrava', 'entravamo', 'entravate', 'entravano',
  'entrai', 'entrasti', 'entrò', 'entrammo', 'entraste', 'entrarono', 'entrerò', 'entrerai', 'entrerà', 'entreremo', 'entrerete', 'entreranno',
  'entri', 'entrino', 'entrassi', 'entrasse', 'entrassimo', 'entraste', 'entrassero',
  'entrerei', 'entreresti', 'entrerebbe', 'entreremmo', 'entrereste', 'entrerebbero',
  'entrato', 'entrata', 'entrati', 'entrate', 'entrando',

  // USCIRE
  'uscire', 'esco', 'esci', 'esce', 'usciamo', 'uscite', 'escono', 'uscivo', 'uscivi', 'usciva', 'uscivamo', 'uscivate', 'uscivano',
  'uscii', 'uscisti', 'uscì', 'uscimmo', 'usciste', 'uscirono', 'uscirò', 'uscirai', 'uscirà', 'usciremo', 'uscirete', 'usciranno',
  'esca', 'escano', 'uscissi', 'uscisse', 'uscissimo', 'usciste', 'uscissero',
  'uscirei', 'usciresti', 'uscirebbe', 'usciremmo', 'uscireste', 'uscirebbero',
  'uscito', 'uscita', 'usciti', 'uscite', 'uscendo',

  // METTERE
  'mettere', 'metto', 'metti', 'mette', 'mettiamo', 'mettete', 'mettono', 'mettevo', 'mettevi', 'metteva', 'mettevamo', 'mettevate', 'mettevano',
  'misi', 'mettesti', 'mise', 'mettemmo', 'metteste', 'misero', 'metterò', 'metterai', 'metterà', 'metteremo', 'metterete', 'metteranno',
  'metta', 'mettano', 'mettessi', 'mettesse', 'mettessimo', 'metteste', 'mettessero',
  'metterei', 'metteresti', 'metterebbe', 'metteremmo', 'mettereste', 'metterebbero',
  'messo', 'messa', 'messi', 'messe', 'mettendo',

  // RIMANERE
  'rimanere', 'rimango', 'rimani', 'rimane', 'rimaniamo', 'rimanete', 'rimangono', 'rimanevo', 'rimanevi', 'rimaneva', 'rimanevamo', 'rimanevate', 'rimanevano',
  'rimasi', 'rimanesti', 'rimase', 'rimanemmo', 'rimaneste', 'rimasero', 'rimarrò', 'rimarrai', 'rimarrà', 'rimarremo', 'rimarrete', 'rimarranno',
  'rimanga', 'rimangano', 'rimanessi', 'rimanesse', 'rimanessimo', 'rimaneste', 'rimanessero',
  'rimarrei', 'rimarresti', 'rimarrebbe', 'rimarremmo', 'rimarreste', 'rimarrebbero',
  'rimasto', 'rimasta', 'rimasti', 'rimaste', 'rimanendo',

  // CREDERE
  'credere', 'credo', 'credi', 'crede', 'crediamo', 'credete', 'credono', 'credevo', 'credevi', 'credeva', 'credevamo', 'credevate', 'credevano',
  'credei', 'credesti', 'credette', 'credemmo', 'credeste', 'credettero', 'crederò', 'crederai', 'crederà', 'crederemo', 'crederete', 'crederanno',
  'creda', 'credano', 'credessi', 'credesse', 'credessimo', 'credeste', 'credessero',
  'crederei', 'crederesti', 'crederebbe', 'crederemmo', 'credereste', 'crederebbero',
  'creduto', 'creduta', 'creduti', 'credute', 'credendo',

  // PENSARE
  'pensare', 'penso', 'pensi', 'pensa', 'pensiamo', 'pensate', 'pensano', 'pensavo', 'pensavi', 'pensava', 'pensavamo', 'pensavate', 'pensavano',
  'pensai', 'pensasti', 'pensò', 'pensammo', 'pensaste', 'pensarono', 'penserò', 'penserai', 'penserà', 'penseremo', 'penserete', 'penseranno',
  'pensi', 'pensino', 'pensassi', 'pensasse', 'pensassimo', 'pensaste', 'pensassero',
  'penserei', 'penseresti', 'penserebbe', 'penseremmo', 'pensereste', 'penserebbero',
  'pensato', 'pensata', 'pensati', 'pensate', 'pensando',

  // PORTARE
  'portare', 'porto', 'porti', 'porta', 'portiamo', 'portate', 'portano', 'portavo', 'portavi', 'portava', 'portavamo', 'portavate', 'portavano',
  'portai', 'portasti', 'portò', 'portammo', 'portaste', 'portarono', 'porterò', 'porterai', 'porterà', 'porteremo', 'porterete', 'porteranno',
  'porti', 'portino', 'portassi', 'portasse', 'portassimo', 'portaste', 'portassero',
  'porterei', 'porteresti', 'porterebbe', 'porteremmo', 'portereste', 'porterebbero',
  'portato', 'portata', 'portati', 'portate', 'portando',

  // TORNARE
  'tornare', 'torno', 'torni', 'torna', 'torniamo', 'tornate', 'tornano', 'tornavo', 'tornavi', 'tornava', 'tornavamo', 'tornavate', 'tornavano',
  'tornai', 'tornasti', 'tornò', 'tornammo', 'tornaste', 'tornarono', 'tornerò', 'tornerai', 'tornerà', 'torneremo', 'tornerete', 'torneranno',
  'torni', 'tornino', 'tornassi', 'tornasse', 'tornassimo', 'tornaste', 'tornassero',
  'tornerei', 'torneresti', 'tornerebbe', 'torneremmo', 'tornereste', 'tornerebbero',
  'tornato', 'tornata', 'tornati', 'tornate', 'tornando',

  // SEMBRARE
  'sembrare', 'sembro', 'sembri', 'sembra', 'sembriamo', 'sembrate', 'sembrano', 'sembravo', 'sembravi', 'sembrava', 'sembravamo', 'sembravate', 'sembravano',
  'sembrai', 'sembrasti', 'sembrò', 'sembrammo', 'sembraste', 'sembrarono', 'sembrerò', 'sembrerai', 'sembrerà', 'sembreremo', 'sembrerete', 'sembreranno',
  'sembri', 'sembrino', 'sembrassi', 'sembrasse', 'sembrassimo', 'sembraste', 'sembrassero',
  'sembrerei', 'sembreresti', 'sembrerebbe', 'sembreremmo', 'sembrereste', 'sembrerebbero',
  'sembrato', 'sembrata', 'sembrati', 'sembrate', 'sembrando',

  // TENERE
  'tenere', 'tengo', 'tieni', 'tiene', 'teniamo', 'tenete', 'tengono', 'tenevo', 'tenevi', 'teneva', 'tenevamo', 'tenevate', 'tenevano',
  'tenni', 'tenesti', 'tenne', 'tenemmo', 'teneste', 'tennero', 'terrò', 'terrai', 'terrà', 'terremo', 'terrete', 'terranno',
  'tenga', 'tengano', 'tenessi', 'tenesse', 'tenessimo', 'teneste', 'tenessero',
  'terrei', 'terresti', 'terrebbe', 'terremmo', 'terreste', 'terrebbero',
  'tenuto', 'tenuta', 'tenuti', 'tenute', 'tenendo',

  // PASSARE
  'passare', 'passo', 'passi', 'passa', 'passiamo', 'passate', 'passano', 'passavo', 'passavi', 'passava', 'passavamo', 'passavate', 'passavano',
  'passai', 'passasti', 'passò', 'passammo', 'passaste', 'passarono', 'passerò', 'passerai', 'passerà', 'passeremo', 'passerete', 'passeranno',
  'passi', 'passino', 'passassi', 'passasse', 'passassimo', 'passaste', 'passassero',
  'passerei', 'passeresti', 'passerebbe', 'passeremmo', 'passereste', 'passerebbero',
  'passato', 'passata', 'passati', 'passate', 'passando',

  // CHIUDERE
  'chiudere', 'chiudo', 'chiudi', 'chiude', 'chiudiamo', 'chiudete', 'chiudono', 'chiudevo', 'chiudevi', 'chiudeva', 'chiudevamo', 'chiudevate', 'chiudevano',
  'chiusi', 'chiudesti', 'chiuse', 'chiudemmo', 'chiudeste', 'chiusero', 'chiuderò', 'chiuderai', 'chiuderà', 'chiuderemo', 'chiuderete', 'chiuderanno',
  'chiuda', 'chiudano', 'chiudessi', 'chiudesse', 'chiudessimo', 'chiudeste', 'chiudessero',
  'chiuderei', 'chiuderesti', 'chiuderebbe', 'chiuderemmo', 'chiudereste', 'chiuderebbero',
  'chiuso', 'chiusa', 'chiusi', 'chiuse', 'chiudendo',

  // APRIRE
  'aprire', 'apro', 'apri', 'apre', 'apriamo', 'aprite', 'aprono', 'aprivo', 'aprivi', 'apriva', 'aprivamo', 'aprivate', 'aprivano',
  'aprii', 'apristi', 'aprì', 'aprimmo', 'apriste', 'aprirono', 'aprirò', 'aprirai', 'aprirà', 'apriremo', 'aprirete', 'apriranno',
  'apra', 'aprano', 'aprissi', 'aprisse', 'aprissimo', 'apriste', 'aprissero',
  'aprirei', 'apriresti', 'aprirebbe', 'apriremmo', 'aprireste', 'aprirebbero',
  'aperto', 'aperta', 'aperti', 'aperte', 'aprendo',

  // SCRIVERE
  'scrivere', 'scrivo', 'scrivi', 'scrive', 'scriviamo', 'scrivete', 'scrivono', 'scrivevo', 'scrivevi', 'scriveva', 'scrivevamo', 'scrivevate', 'scrivevano',
  'scrissi', 'scrivesti', 'scrisse', 'scrivemmo', 'scriveste', 'scrissero', 'scriverò', 'scriverai', 'scriverà', 'scriveremo', 'scriverete', 'scriveranno',
  'scriva', 'scrivano', 'scrivessi', 'scrivesse', 'scrivessimo', 'scriveste', 'scrivessero',
  'scriverei', 'scriveresti', 'scriverebbe', 'scriveremmo', 'scrivereste', 'scriverebbero',
  'scritto', 'scritta', 'scritti', 'scritte', 'scrivendo',

  // LEGGERE
  'leggere', 'leggo', 'leggi', 'legge', 'leggiamo', 'leggete', 'leggono', 'leggevo', 'leggevi', 'leggeva', 'leggevamo', 'leggevate', 'leggevano',
  'lessi', 'leggesti', 'lesse', 'leggemmo', 'leggeste', 'lessero', 'leggerò', 'leggerai', 'leggerà', 'leggeremo', 'leggerete', 'leggeranno',
  'legga', 'leggano', 'leggessi', 'leggesse', 'leggessimo', 'leggeste', 'leggessero',
  'leggerei', 'leggeresti', 'leggerebbe', 'leggeremmo', 'leggereste', 'leggerebbero',
  'letto', 'letta', 'letti', 'lette', 'leggendo',

  // CORRERE
  'correre', 'corro', 'corri', 'corre', 'corriamo', 'correte', 'corrono', 'correvo', 'correvi', 'correva', 'correvamo', 'correvate', 'correvano',
  'corsi', 'corresti', 'corse', 'corremmo', 'correste', 'corsero', 'correrò', 'correrai', 'correrà', 'correremo', 'correrete', 'correranno',
  'corra', 'corrano', 'corressi', 'corresse', 'corressimo', 'correste', 'corressero',
  'correrei', 'correresti', 'correrebbe', 'correremmo', 'correreste', 'correrebbero',
  'corso', 'corsa', 'corsi', 'corse', 'correndo',

  // VIVERE
  'vivere', 'vivo', 'vivi', 'vive', 'viviamo', 'vivete', 'vivono', 'vivevo', 'vivevi', 'viveva', 'vivevamo', 'vivevate', 'vivevano',
  'vissi', 'vivesti', 'visse', 'vivemmo', 'viveste', 'vissero', 'vivrò', 'vivrai', 'vivrà', 'vivremo', 'vivrete', 'vivranno',
  'viva', 'vivano', 'vivessi', 'vivesse', 'vivessimo', 'viveste', 'vivessero',
  'vivrei', 'vivresti', 'vivrebbe', 'vivremmo', 'vivreste', 'vivrebbero',
  'vissuto', 'vissuta', 'vissuti', 'vissute', 'vivendo',

  // MORIRE
  'morire', 'muoio', 'muori', 'muore', 'moriamo', 'morite', 'muoiono', 'morivo', 'morivi', 'moriva', 'morivamo', 'morivate', 'morivano',
  'morii', 'moristi', 'morì', 'morimmo', 'moriste', 'morirono', 'morirò', 'morirai', 'morirà', 'moriremo', 'morirete', 'moriranno',
  'muoia', 'muoiano', 'morissi', 'morisse', 'morissimo', 'moriste', 'morissero',
  'morirei', 'moriresti', 'morirebbe', 'moriremmo', 'morireste', 'morirebbero',
  'morto', 'morta', 'morti', 'morte', 'morendo',

  // PERDERE
  'perdere', 'perdo', 'perdi', 'perde', 'perdiamo', 'perdete', 'perdono', 'perdevo', 'perdevi', 'perdeva', 'perdevamo', 'perdevate', 'perdevano',
  'persi', 'perdesti', 'perse', 'perdemmo', 'perdeste', 'persero', 'perderò', 'perderai', 'perderà', 'perderemo', 'perderete', 'perderanno',
  'perda', 'perdano', 'perdessi', 'perdesse', 'perdessimo', 'perdeste', 'perdessero',
  'perderei', 'perderesti', 'perderebbe', 'perderemmo', 'perdereste', 'perderebbero',
  'perso', 'persa', 'persi', 'perse', 'perdendo',

  // VINCERE
  'vincere', 'vinco', 'vinci', 'vince', 'vinciamo', 'vincete', 'vincono', 'vincevo', 'vincevi', 'vinceva', 'vincevamo', 'vincevate', 'vincevano',
  'vinsi', 'vincesti', 'vinse', 'vincemmo', 'vinceste', 'vinsero', 'vincerò', 'vincerai', 'vincerà', 'vinceremo', 'vincerete', 'vinceranno',
  'vinca', 'vincano', 'vincessi', 'vincesse', 'vincessimo', 'vinceste', 'vincessero',
  'vincerei', 'vinceresti', 'vincerebbe', 'vinceremmo', 'vincereste', 'vincerebbero',
  'vinto', 'vinta', 'vinti', 'vinte', 'vincendo',

  // PIACERE
  'piacere', 'piaccio', 'piaci', 'piace', 'piacciamo', 'piacete', 'piacciono', 'piacevo', 'piacevi', 'piaceva', 'piacevamo', 'piacevate', 'piacevano',
  'piacqui', 'piacesti', 'piacque', 'piacemmo', 'piaceste', 'piacquero', 'piacerò', 'piacerai', 'piacerà', 'piaceremo', 'piacerete', 'piaceranno',
  'piaccia', 'piacciano', 'piacessi', 'piacesse', 'piacessimo', 'piaceste', 'piacessero',
  'piacerei', 'piaceresti', 'piacerebbe', 'piaceremmo', 'piacereste', 'piacerebbero',
  'piaciuto', 'piaciuta', 'piaciuti', 'piaciute', 'piacendo',

  // CONTINUARE
  'continuare', 'continuo', 'continui', 'continua', 'continuiamo', 'continuate', 'continuano', 'continuavo', 'continuavi', 'continuava', 'continuavamo', 'continuavate', 'continuavano',
  'continuai', 'continuasti', 'continuò', 'continuammo', 'continuaste', 'continuarono', 'continuerò', 'continuerai', 'continuerà', 'continueremo', 'continuerete', 'continueranno',
  'continui', 'continuino', 'continuassi', 'continuasse', 'continuassimo', 'continuaste', 'continuassero',
  'continuerei', 'continueresti', 'continuerebbe', 'continueremmo', 'continuereste', 'continuerebbero',
  'continuato', 'continuata', 'continuati', 'continuate', 'continuando',

  // PROSEGUIRE
  'proseguire', 'proseguo', 'prosegui', 'prosegue', 'proseguiamo', 'proseguite', 'proseguono', 'proseguivo', 'proseguivi', 'proseguiva', 'proseguivamo', 'proseguivate', 'proseguivano',
  'proseguii', 'proseguisti', 'proseguì', 'proseguimmo', 'proseguiste', 'proseguirono', 'proseguirò', 'proseguirai', 'proseguirà', 'proseguiremo', 'proseguirete', 'proseguiranno',
  'prosegua', 'proseguano', 'proseguissi', 'proseguisse', 'proseguissimo', 'proseguiste', 'proseguissero',
  'proseguirei', 'proseguiresti', 'proseguirebbe', 'proseguiremmo', 'proseguireste', 'proseguirebbero',
  'proseguito', 'proseguita', 'proseguiti', 'proseguite', 'proseguendo',

  // SEGUIRE
  'seguire', 'seguo', 'segui', 'segue', 'seguiamo', 'seguite', 'seguono', 'seguivo', 'seguivi', 'seguiva', 'seguivamo', 'seguivate', 'seguivano',
  'seguii', 'seguisti', 'seguì', 'seguimmo', 'seguiste', 'seguirono', 'seguirò', 'seguirai', 'seguirà', 'seguiremo', 'seguirete', 'seguiranno',
  'segua', 'seguano', 'seguissi', 'seguisse', 'seguissimo', 'seguiste', 'seguissero',
  'seguirei', 'seguiresti', 'seguirebbe', 'seguiremmo', 'seguireste', 'seguirebbero',
  'seguito', 'seguita', 'seguiti', 'seguite', 'seguendo',

  // ASPETTARE
  'aspettare', 'aspetto', 'aspetti', 'aspetta', 'aspettiamo', 'aspettate', 'aspettano', 'aspettavo', 'aspettavi', 'aspettava', 'aspettavamo', 'aspettavate', 'aspettavano',
  'aspettai', 'aspettasti', 'aspettò', 'aspettammo', 'aspettaste', 'aspettarono', 'aspetterò', 'aspetterai', 'aspetterà', 'aspetteremo', 'aspetterete', 'aspetteranno',
  'aspetti', 'aspettino', 'aspettassi', 'aspettasse', 'aspettassimo', 'aspettaste', 'aspettassero',
  'aspetterei', 'aspetteresti', 'aspetterebbe', 'aspetteremmo', 'aspettereste', 'aspetterebbero',
  'aspettato', 'aspettata', 'aspettati', 'aspettate', 'aspettando',

  // GUARDARE
  'guardare', 'guardo', 'guardi', 'guarda', 'guardiamo', 'guardate', 'guardano', 'guardavo', 'guardavi', 'guardava', 'guardavamo', 'guardavate', 'guardavano',
  'guardai', 'guardasti', 'guardò', 'guardammo', 'guardaste', 'guardarono', 'guarderò', 'guarderai', 'guarderà', 'guarderemo', 'guarderete', 'guarderanno',
  'guardi', 'guardino', 'guardassi', 'guardasse', 'guardassimo', 'guardaste', 'guardassero',
  'guarderei', 'guarderesti', 'guarderebbe', 'guarderemmo', 'guardereste', 'guarderebbero',
  'guardato', 'guardata', 'guardati', 'guardate', 'guardando',

  // GIOCARE
  'giocare', 'gioco', 'giochi', 'gioca', 'giochiamo', 'giocate', 'giocano', 'giocavo', 'giocavi', 'giocava', 'giocavamo', 'giocavate', 'giocavano',
  'giocai', 'giocasti', 'giocò', 'giocammo', 'giocaste', 'giocarono', 'giocherò', 'giocherai', 'giocherà', 'giocheremo', 'giocherete', 'giocheranno',
  'giochi', 'giochino', 'giocassi', 'giocasse', 'giocassimo', 'giocaste', 'giocassero',
  'giocherei', 'giocheresti', 'giocherebbe', 'giocheremmo', 'giochereste', 'giocherebbero',
  'giocato', 'giocata', 'giocati', 'giocate', 'giocando',

  // LAVORARE
  'lavorare', 'lavoro', 'lavori', 'lavora', 'lavoriamo', 'lavorate', 'lavorano', 'lavoravo', 'lavoravi', 'lavorava', 'lavoravamo', 'lavoravate', 'lavoravano',
  'lavorai', 'lavorasti', 'lavorò', 'lavorammo', 'lavoraste', 'lavorarono', 'lavorerò', 'lavorerai', 'lavorerà', 'lavoreremo', 'lavorerete', 'lavoreranno',
  'lavori', 'lavorino', 'lavorassi', 'lavorasse', 'lavorassimo', 'lavoraste', 'lavorassero',
  'lavorerei', 'lavoreresti', 'lavorerebbe', 'lavoreremmo', 'lavorereste', 'lavorerebbero',
  'lavorato', 'lavorata', 'lavorati', 'lavorate', 'lavorando',

  // CAMMINARE
  'camminare', 'cammino', 'cammini', 'cammina', 'camminiamo', 'camminate', 'camminano', 'camminavo', 'camminavi', 'camminava', 'camminavamo', 'camminavate', 'camminavano',
  'camminai', 'camminasti', 'camminò', 'camminammo', 'camminaste', 'camminarono', 'camminerò', 'camminerai', 'camminerà', 'cammineremo', 'camminerete', 'cammineranno',
  'cammini', 'camminino', 'camminassi', 'camminasse', 'camminassimo', 'camminaste', 'camminassero',
  'camminerei', 'cammineresti', 'camminerebbe', 'cammineremmo', 'camminereste', 'camminerebbero',
  'camminato', 'camminata', 'camminati', 'camminate', 'camminando',

  // SALTARE
  'saltare', 'salto', 'salti', 'salta', 'saltiamo', 'saltate', 'saltano', 'saltavo', 'saltavi', 'saltava', 'saltavamo', 'saltavate', 'saltavano',
  'saltai', 'saltasti', 'saltò', 'saltammo', 'saltaste', 'saltarono', 'salterò', 'salterai', 'salterà', 'salteremo', 'salterete', 'salteranno',
  'salti', 'saltino', 'saltassi', 'saltasse', 'saltassimo', 'saltaste', 'saltassero',
  'salterei', 'salteresti', 'salterebbe', 'salteremmo', 'saltereste', 'salterebbero',
  'saltato', 'saltata', 'saltati', 'saltate', 'saltando',

  // AMARE
  'amare', 'amo', 'ami', 'ama', 'amiamo', 'amate', 'amano', 'amavo', 'amavi', 'amava', 'amavamo', 'amavate', 'amavano',
  'amai', 'amasti', 'amò', 'amammo', 'amaste', 'amarono', 'amerò', 'amerai', 'amerà', 'ameremo', 'amerete', 'ameranno',
  'ami', 'amino', 'amassi', 'amasse', 'amassimo', 'amaste', 'amassero',
  'amerei', 'ameresti', 'amerebbe', 'ameremmo', 'amereste', 'amerebbero',
  'amato', 'amata', 'amati', 'amate', 'amando',

  // ODIARE
  'odiare', 'odio', 'odi', 'odia', 'odiamo', 'odiate', 'odiano', 'odiavo', 'odiavi', 'odiava', 'odiavamo', 'odiavate', 'odiavano',
  'odiai', 'odiasti', 'odiò', 'odiammo', 'odiaste', 'odiarono', 'odierò', 'odierai', 'odierà', 'odieremo', 'odierete', 'odieranno',
  'odi', 'odino', 'odiassi', 'odiasse', 'odiassimo', 'odiaste', 'odiassero',
  'odierei', 'odieresti', 'odierebbe', 'odieremmo', 'odiereste', 'odierebbero',
  'odiato', 'odiata', 'odiati', 'odiate', 'odiando',

  // CHIAMARE
  'chiamare', 'chiamo', 'chiami', 'chiama', 'chiamiamo', 'chiamate', 'chiamano', 'chiamavo', 'chiamavi', 'chiamava', 'chiamavamo', 'chiamavate', 'chiamavano',
  'chiamai', 'chiamasti', 'chiamò', 'chiamammo', 'chiamaste', 'chiamarono', 'chiamerò', 'chiamerai', 'chiamerà', 'chiameremo', 'chiamerete', 'chiameranno',
  'chiami', 'chiamino', 'chiamassi', 'chiamasse', 'chiamassimo', 'chiamaste', 'chiamassero',
  'chiamerei', 'chiameresti', 'chiamerebbe', 'chiameremmo', 'chiamereste', 'chiamerebbero',
  'chiamato', 'chiamata', 'chiamati', 'chiamate', 'chiamando',

  // RISPONDERE
  'rispondere', 'rispondo', 'rispondi', 'risponde', 'rispondiamo', 'rispondete', 'rispondono', 'rispondevo', 'rispondevi', 'rispondeva', 'rispondevamo', 'rispondevate', 'rispondevano',
  'risposi', 'rispondesti', 'rispose', 'rispondemmo', 'rispondeste', 'risposero', 'risponderò', 'risponderai', 'risponderà', 'risponderemo', 'risponderete', 'risponderanno',
  'risponda', 'rispondano', 'rispondessi', 'rispondesse', 'rispondessimo', 'rispondeste', 'rispondessero',
  'risponderei', 'risponderesti', 'risponderebbe', 'risponderemmo', 'rispondereste', 'risponderebbero',
  'risposto', 'risposta', 'risposti', 'risposte', 'rispondendo',

  // DOMANDARE
  'domandare', 'domando', 'domandi', 'domanda', 'domandiamo', 'domandate', 'domandano', 'domandavo', 'domandavi', 'domandava', 'domandavamo', 'domandavate', 'domandavano',
  'domandai', 'domandasti', 'domandò', 'domandammo', 'domandaste', 'domandarono', 'domanderò', 'domanderai', 'domanderà', 'domanderemo', 'domanderete', 'domanderanno',
  'domandi', 'domandino', 'domandassi', 'domandasse', 'domandassimo', 'domandaste', 'domandassero',
  'domanderei', 'domanderesti', 'domanderebbe', 'domanderemmo', 'domandereste', 'domanderebbero',
  'domandato', 'domandata', 'domandati', 'domandate', 'domandando',

  // TROVARE
  'trovare', 'trovo', 'trovi', 'trova', 'troviamo', 'trovate', 'trovano', 'trovavo', 'trovavi', 'trovava', 'trovavamo', 'trovavate', 'trovavano',
  'trovai', 'trovasti', 'trovò', 'trovammo', 'trovaste', 'trovarono', 'troverò', 'troverai', 'troverà', 'troveremo', 'troverete', 'troveranno',
  'trovi', 'trovino', 'trovassi', 'trovasse', 'trovassimo', 'trovaste', 'trovassero',
  'troverei', 'troveresti', 'troverebbe', 'troveremmo', 'trovereste', 'troverebbero',
  'trovato', 'trovata', 'trovati', 'trovate', 'trovando',

  // CERCARE
  'cercare', 'cerco', 'cerchi', 'cerca', 'cerchiamo', 'cercate', 'cercano', 'cercavo', 'cercavi', 'cercava', 'cercavamo', 'cercavate', 'cercavano',
  'cercai', 'cercasti', 'cercò', 'cercammo', 'cercaste', 'cercarono', 'cercherò', 'cercherai', 'cercherà', 'cercheremo', 'cercherete', 'cercheranno',
  'cerchi', 'cerchino', 'cercassi', 'cercasse', 'cercassimo', 'cercaste', 'cercassero',
  'cercherei', 'cercheresti', 'cercherebbe', 'cercheremmo', 'cerchereste', 'cercherebbero',
  'cercato', 'cercata', 'cercati', 'cercate', 'cercando',

  // PROVARE
  'provare', 'provo', 'provi', 'prova', 'proviamo', 'provate', 'provano', 'provavo', 'provavi', 'provava', 'provavamo', 'provavate', 'provavano',
  'provai', 'provasti', 'provò', 'provammo', 'provaste', 'provarono', 'proverò', 'proverai', 'proverà', 'proveremo', 'proverete', 'proveranno',
  'provi', 'provino', 'provassi', 'provasse', 'provassimo', 'provaste', 'provassero',
  'proverei', 'proveresti', 'proverebbe', 'proveremmo', 'provereste', 'proverebbero',
  'provato', 'provata', 'provati', 'provate', 'provando',

  // RIUSCIRE
  'riuscire', 'riesco', 'riesci', 'riesce', 'riusciamo', 'riuscite', 'riescono', 'riuscivo', 'riuscivi', 'riusciva', 'riuscivamo', 'riuscivate', 'riuscivano',
  'riuscii', 'riuscisti', 'riuscì', 'riuscimmo', 'riusciste', 'riuscirono', 'riuscirò', 'riuscirai', 'riuscirà', 'riusciremo', 'riuscirete', 'riusciranno',
  'riesca', 'riescano', 'riuscissi', 'riuscisse', 'riuscissimo', 'riusciste', 'riuscissero',
  'riuscirei', 'riusciresti', 'riuscirebbe', 'riusciremmo', 'riuscireste', 'riuscirebbero',
  'riuscito', 'riuscita', 'riusciti', 'riuscite', 'riuscendo',

  // DIVENTARE
  'diventare', 'divento', 'diventi', 'diventa', 'diventiamo', 'diventate', 'diventano', 'diventavo', 'diventavi', 'diventava', 'diventavamo', 'diventavate', 'diventavano',
  'diventai', 'diventasti', 'diventò', 'diventammo', 'diventaste', 'diventarono', 'diventerò', 'diventerai', 'diventerà', 'diventeremo', 'diventerete', 'diventeranno',
  'diventi', 'diventino', 'diventassi', 'diventasse', 'diventassimo', 'diventaste', 'diventassero',
  'diventerei', 'diventeresti', 'diventerebbe', 'diventeremmo', 'diventereste', 'diventerebbero',
  'diventato', 'diventata', 'diventati', 'diventate', 'diventando',

  // SEMBRARE
  'sembrare', 'sembro', 'sembri', 'sembra', 'sembriamo', 'sembrate', 'sembrano', 'sembravo', 'sembravi', 'sembrava', 'sembravamo', 'sembravate', 'sembravano',
  'sembrai', 'sembrasti', 'sembrò', 'sembrammo', 'sembraste', 'sembrarono', 'sembrerò', 'sembrerai', 'sembrerà', 'sembreremo', 'sembrerete', 'sembreranno',
  'sembri', 'sembrino', 'sembrassi', 'sembrasse', 'sembrassimo', 'sembraste', 'sembrassero',
  'sembrerei', 'sembreresti', 'sembrerebbe', 'sembreremmo', 'sembrereste', 'sembrerebbero',
  'sembrato', 'sembrata', 'sembrati', 'sembrate', 'sembrando',

  // PIACERE
  'piacere', 'piaccio', 'piaci', 'piace', 'piacciamo', 'piacete', 'piacciono', 'piacevo', 'piacevi', 'piaceva', 'piacevamo', 'piacevate', 'piacevano',
  'piacqui', 'piacesti', 'piacque', 'piacemmo', 'piaceste', 'piacquero', 'piacerò', 'piacerai', 'piacerà', 'piaceremo', 'piacerete', 'piaceranno',
  'piaccia', 'piacciano', 'piacessi', 'piacesse', 'piacessimo', 'piaceste', 'piacessero',
  'piacerei', 'piaceresti', 'piacerebbe', 'piaceremmo', 'piacereste', 'piacerebbero',
  'piaciuto', 'piaciuta', 'piaciuti', 'piaciute', 'piacendo',

  // MANCARE
  'mancare', 'manco', 'manchi', 'manca', 'manchiamo', 'mancate', 'mancano', 'mancavo', 'mancavi', 'mancava', 'mancavamo', 'mancavate', 'mancavano',
  'mancai', 'mancasti', 'mancò', 'mancammo', 'mancaste', 'mancarono', 'mancherò', 'mancherai', 'mancherà', 'mancheremo', 'mancherete', 'mancheranno',
  'manchi', 'manchino', 'mancassi', 'mancasse', 'mancassimo', 'mancaste', 'mancassero',
  'mancherei', 'mancheresti', 'mancherebbe', 'mancheremmo', 'manchereste', 'mancherebbero',
  'mancato', 'mancata', 'mancati', 'mancate', 'mancando',

  // SUCCEDERE
  'succedere', 'succedo', 'succedi', 'succede', 'succediamo', 'succedete', 'succedono', 'succedevo', 'succedevi', 'succedeva', 'succedevamo', 'succedevate', 'succedevano',
  'successi', 'succedesti', 'successe', 'succedemmo', 'succedeste', 'successero', 'succederò', 'succederai', 'succederà', 'succederemo', 'succederete', 'succederanno',
  'succeda', 'succedano', 'succedessi', 'succedesse', 'succedessimo', 'succedeste', 'succedessero',
  'succederei', 'succederesti', 'succederebbe', 'succederemmo', 'succedereste', 'succederebbero',
  'successo', 'successa', 'successi', 'successe', 'succedendo',

  // ACCADERE
  'accadere', 'accade', 'accadono', 'accadeva', 'accadevano', 'accadde', 'accaddero', 'accadrà', 'accadranno',
  'accada', 'accadano', 'accadesse', 'accadessero', 'accadrebbe', 'accadrebbero',
  'accaduto', 'accaduta', 'accaduti', 'accadute', 'accadendo',

  // BISOGNARE
  'bisognare', 'bisogna', 'bisognava', 'bisognò', 'bisognerà', 'bisogni', 'bisognasse', 'bisognerebbe', 'bisognato', 'bisognando',

  // IMPORTARE
  'importare', 'importo', 'importi', 'importa', 'importiamo', 'importate', 'importano', 'importavo', 'importavi', 'importava', 'importavamo', 'importavate', 'importavano',
  'importai', 'importasti', 'importò', 'importammo', 'importaste', 'importarono', 'importerò', 'importerai', 'importerà', 'importeremo', 'importerete', 'importeranno',
  'importi', 'importino', 'importassi', 'importasse', 'importassimo', 'importaste', 'importassero',
  'importerei', 'importeresti', 'importerebbe', 'importeremmo', 'importereste', 'importerebbero',
  'importato', 'importata', 'importati', 'importate', 'importando',

  // SMETTERE
  'smettere', 'smetto', 'smetti', 'smette', 'smettiamo', 'smettete', 'smettono', 'smettevo', 'smettevi', 'smetteva', 'smettevamo', 'smettevate', 'smettevano',
  'smisi', 'smettesti', 'smise', 'smettemmo', 'smetteste', 'smisero', 'smetterò', 'smetterai', 'smetterà', 'smetteremo', 'smetterete', 'smetteranno',
  'smetta', 'smettano', 'smettessi', 'smettesse', 'smettessimo', 'smetteste', 'smettessero',
  'smetterei', 'smetteresti', 'smetterebbe', 'smetteremmo', 'smettereste', 'smetterebbero',
  'smesso', 'smessa', 'smessi', 'smesse', 'smettendo',

  // FINIRE
  'finire', 'finisco', 'finisci', 'finisce', 'finiamo', 'finite', 'finiscono', 'finivo', 'finivi', 'finiva', 'finivamo', 'finivate', 'finivano',
  'finii', 'finisti', 'finì', 'finimmo', 'finiste', 'finirono', 'finirò', 'finirai', 'finirà', 'finiremo', 'finirete', 'finiranno',
  'finisca', 'finiscano', 'finissi', 'finisse', 'finissimo', 'finiste', 'finissero',
  'finirei', 'finiresti', 'finirebbe', 'finiremmo', 'finireste', 'finirebbero',
  'finito', 'finita', 'finiti', 'finite', 'finendo',

  // INIZIARE
  'iniziare', 'inizio', 'inizi', 'inizia', 'iniziamo', 'iniziate', 'iniziano', 'iniziavo', 'iniziavi', 'iniziava', 'iniziavamo', 'iniziavate', 'iniziavano',
  'iniziai', 'iniziasti', 'iniziò', 'iniziammo', 'iniziaste', 'iniziarono', 'inizierò', 'inizierai', 'inizierà', 'inizieremo', 'inizierete', 'inizieranno',
  'inizi', 'inizino', 'iniziassi', 'iniziasse', 'iniziassimo', 'iniziaste', 'iniziassero',
  'inizierei', 'inizieresti', 'inizierebbe', 'inizieremmo', 'iniziereste', 'inizierebbero',
  'iniziato', 'iniziata', 'iniziati', 'iniziate', 'iniziando',

  // COMINCIARE
  'cominciare', 'comincio', 'cominci', 'comincia', 'cominciamo', 'cominciate', 'cominciano', 'cominciavo', 'cominciavi', 'cominciava', 'cominciavamo', 'cominciavate', 'cominciavano',
  'cominciai', 'cominciasti', 'cominciò', 'cominciammo', 'cominciaste', 'cominciarono', 'comincerò', 'comincerai', 'comincerà', 'cominceremo', 'comincerete', 'cominceranno',
  'cominci', 'comincino', 'cominciassi', 'cominciasse', 'cominciassimo', 'cominciaste', 'cominciassero',
  'comincerei', 'cominceresti', 'comincerebbe', 'cominceremmo', 'comincereste', 'comincerebbero',
  'cominciato', 'cominciata', 'cominciati', 'cominciate', 'cominciando',

  // FERMARE
  'fermare', 'fermo', 'fermi', 'ferma', 'fermiamo', 'fermate', 'fermano', 'fermavo', 'fermavi', 'fermava', 'fermavamo', 'fermavate', 'fermano',
  'fermai', 'fermasti', 'fermò', 'fermammo', 'fermaste', 'fermarono', 'fermerò', 'fermerai', 'fermerà', 'fermeremo', 'fermerete', 'fermeranno',
  'fermi', 'fermino', 'fermassi', 'fermasse', 'fermassimo', 'fermaste', 'fermassero',
  'fermerei', 'fermeresti', 'fermerebbe', 'fermeremmo', 'fermereste', 'fermerebbero',
  'fermato', 'fermata', 'fermati', 'fermate', 'fermando',

  // MUOVERE
  'muovere', 'muovo', 'muovi', 'muove', 'muoviamo', 'muovete', 'muovono', 'muovevo', 'muovevi', 'muoveva', 'muovevamo', 'muovevate', 'muovevano',
  'mossi', 'muovesti', 'mosse', 'muovemmo', 'muoveste', 'mossero', 'muoverò', 'muoverai', 'muoverà', 'muoveremo', 'muoverete', 'muoveranno',
  'muova', 'muovano', 'muovessi', 'muovesse', 'muovessimo', 'muoveste', 'muovessero',
  'muoverei', 'muoveresti', 'muoverebbe', 'muoveremmo', 'muovereste', 'muoverebbero',
  'mosso', 'mossa', 'mossi', 'mosse', 'muovendo',

  // ALZARE
  'alzare', 'alzo', 'alzi', 'alza', 'alziamo', 'alzate', 'alzano', 'alzavo', 'alzavi', 'alzava', 'alzavamo', 'alzavate', 'alzavano',
  'alzai', 'alzasti', 'alzò', 'alzammo', 'alzaste', 'alzarono', 'alzerò', 'alzerai', 'alzerà', 'alzeremo', 'alzerete', 'alzeranno',
  'alzi', 'alzino', 'alzassi', 'alzasse', 'alzassimo', 'alzaste', 'alzassero',
  'alzerei', 'alzeresti', 'alzerebbe', 'alzeremmo', 'alzereste', 'alzerebbero',
  'alzato', 'alzata', 'alzati', 'alzate', 'alzando',

  // SEDERE
  'sedere', 'siedo', 'siedi', 'siede', 'sediamo', 'sedete', 'siedono', 'sedevo', 'sedevi', 'sedeva', 'sedevamo', 'sedevate', 'sedevano',
  'sedei', 'sedesti', 'sedette', 'sedemmo', 'sedeste', 'sedettero', 'sederò', 'sederai', 'sederà', 'sederemo', 'sederete', 'sederanno',
  'sieda', 'siedano', 'sedessi', 'sedesse', 'sedessimo', 'sedeste', 'sedessero',
  'sederei', 'sederesti', 'sederebbe', 'sederemmo', 'sedereste', 'sederebbero',
  'seduto', 'seduta', 'seduti', 'sedute', 'sedendo',

  // CADERE
  'cadere', 'cado', 'cadi', 'cade', 'cadiamo', 'cadete', 'cadono', 'cadevo', 'cadevi', 'cadeva', 'cadevamo', 'cadevate', 'cadevano',
  'caddi', 'cadesti', 'cadde', 'cademmo', 'cadeste', 'caddero', 'cadrò', 'cadrai', 'cadrà', 'cadremo', 'cadrete', 'cadranno',
  'cada', 'cadano', 'cadessi', 'cadesse', 'cadessimo', 'cadeste', 'cadessero',
  'cadrei', 'cadresti', 'cadrebbe', 'cadremmo', 'cadreste', 'cadrebbero',
  'caduto', 'caduta', 'caduti', 'cadute', 'cadendo',

  // ROMPERE
  'rompere', 'rompo', 'rompi', 'rompe', 'rompiamo', 'rompete', 'rompono', 'rompevo', 'rompevi', 'rompeva', 'rompevamo', 'rompevate', 'rompevano',
  'ruppi', 'rompesti', 'ruppe', 'rompemmo', 'rompeste', 'ruppero', 'romperò', 'romperai', 'romperà', 'romperemo', 'romperete', 'romperanno',
  'rompa', 'rompano', 'rompessi', 'rompesse', 'rompessimo', 'rompeste', 'rompessero',
  'romperei', 'romperesti', 'romperebbe', 'romperemmo', 'rompereste', 'romperebbero',
  'rotto', 'rotta', 'rotti', 'rotte', 'rompendo',

  // TAGLIARE
  'tagliare', 'taglio', 'tagli', 'taglia', 'tagliamo', 'tagliate', 'tagliano', 'tagliavo', 'tagliavi', 'tagliava', 'tagliavamo', 'tagliavate', 'tagliavano',
  'tagliai', 'tagliasti', 'tagliò', 'tagliammo', 'tagliaste', 'tagliarono', 'taglierò', 'taglierai', 'taglierà', 'taglieremo', 'taglierete', 'taglieranno',
  'tagli', 'taglino', 'tagliassi', 'tagliasse', 'tagliassimo', 'tagliaste', 'tagliassero',
  'taglierei', 'taglieresti', 'taglierebbe', 'taglieremmo', 'tagliereste', 'taglierebbero',
  'tagliato', 'tagliata', 'tagliati', 'tagliate', 'tagliando',

  // COSTRUIRE
  'costruire', 'costruisco', 'costruisci', 'costruisce', 'costruiamo', 'costruite', 'costruiscono', 'costruivo', 'costruivi', 'costruiva', 'costruivamo', 'costruivate', 'costruivano',
  'costruii', 'costruisti', 'costruì', 'costruimmo', 'costruiste', 'costruirono', 'costruirò', 'costruirai', 'costruirà', 'costruiremo', 'costruirete', 'costruiranno',
  'costruisca', 'costruiscano', 'costruissi', 'costruisse', 'costruissimo', 'costruiste', 'costruissero',
  'costruirei', 'costruiresti', 'costruirebbe', 'costruiremmo', 'costruireste', 'costruirebbero',
  'costruito', 'costruita', 'costruiti', 'costruite', 'costruendo',

  // DISTRUGGERE
  'distruggere', 'distruggo', 'distruggi', 'distrugge', 'distruggiamo', 'distruggete', 'distruggono', 'distruggevo', 'distruggevi', 'distruggeva', 'distruggevamo', 'distruggevate', 'distruggevano',
  'distrussi', 'distruggesti', 'distrusse', 'distruggemmo', 'distruggeste', 'distrussero', 'distruggerò', 'distruggerai', 'distruggerà', 'distruggeremo', 'distruggerete', 'distruggeranno',
  'distrugga', 'distruggano', 'distruggessi', 'distruggesse', 'distruggessimo', 'distruggeste', 'distruggessero',
  'distruggerei', 'distruggeresti', 'distruggerebbe', 'distruggeremmo', 'distruggereste', 'distruggerebbero',
  'distrutto', 'distrutta', 'distrutti', 'distrutte', 'distruggendo',

  // PULIRE
  'pulire', 'pulisco', 'pulisci', 'pulisce', 'puliamo', 'pulite', 'puliscono', 'pulivo', 'pulivi', 'puliva', 'pulivamo', 'pulivate', 'pulivano',
  'pulii', 'pulisti', 'pulì', 'pulimmo', 'puliste', 'pulirono', 'pulirò', 'pulirai', 'pulirà', 'puliremo', 'pulirete', 'puliranno',
  'pulisca', 'puliscano', 'pulissi', 'pulisse', 'pulissimo', 'puliste', 'pulissero',
  'pulirei', 'puliresti', 'pulirebbe', 'puliremmo', 'pulireste', 'pulirebbero',
  'pulito', 'pulita', 'puliti', 'pulite', 'pulendo',

  // LAVARE
  'lavare', 'lavo', 'lavi', 'lava', 'laviamo', 'lavate', 'lavano', 'lavavo', 'lavavi', 'lavava', 'lavavamo', 'lavavate', 'lavavano',
  'lavai', 'lavasti', 'lavò', 'lavammo', 'lavaste', 'lavarono', 'laverò', 'laverai', 'laverà', 'laveremo', 'laverete', 'laveranno',
  'lavi', 'lavino', 'lavassi', 'lavasse', 'lavassimo', 'lavaste', 'lavassero',
  'laverei', 'laveresti', 'laverebbe', 'laveremmo', 'lavereste', 'laverebbero',
  'lavato', 'lavata', 'lavati', 'lavate', 'lavando',

  // CUCINARE
  'cucinare', 'cucino', 'cucini', 'cucina', 'cuciniamo', 'cucinate', 'cucinano', 'cucinavo', 'cucinavi', 'cucinava', 'cucinavamo', 'cucinate', 'cucinavano',
  'cucinai', 'cucinasti', 'cucinò', 'cucinammo', 'cucinaste', 'cucinarono', 'cucinerò', 'cucinerai', 'cucinerà', 'cucineremo', 'cucinerete', 'cucineranno',
  'cucini', 'cucinino', 'cucinassi', 'cucinasse', 'cucinassimo', 'cucinaste', 'cucinassero',
  'cucinerei', 'cucineresti', 'cucinerebbe', 'cucineremmo', 'cucinereste', 'cucinerebbero',
  'cucinato', 'cucinata', 'cucinati', 'cucinate', 'cucinando',

  // BERE
  'bere', 'bevo', 'bevi', 'beve', 'beviamo', 'bevete', 'bevono', 'bevevo', 'bevevi', 'beveva', 'bevevamo', 'bevevate', 'bevevano',
  'bevvi', 'bevesti', 'bevve', 'bevemmo', 'beveste', 'bevvero', 'berrò', 'berrai', 'berrà', 'berremo', 'berrete', 'berranno',
  'beva', 'bevano', 'bevessi', 'bevesse', 'bevessimo', 'beveste', 'bevessero',
  'berrei', 'berresti', 'berrebbe', 'berremmo', 'berreste', 'berrebbero',
  'bevuto', 'bevuta', 'bevuti', 'bevute', 'bevendo',

  // RIDERE
  'ridere', 'rido', 'ridi', 'ride', 'ridiamo', 'ridete', 'ridono', 'ridevo', 'ridevi', 'rideva', 'ridevamo', 'ridevate', 'ridevano',
  'risi', 'ridesti', 'rise', 'ridemmo', 'rideste', 'risero', 'riderò', 'riderai', 'riderà', 'rideremo', 'riderete', 'rideranno',
  'rida', 'ridano', 'ridessi', 'ridesse', 'ridessimo', 'rideste', 'ridessero',
  'riderei', 'rideresti', 'riderebbe', 'rideremmo', 'ridereste', 'riderebbero',
  'riso', 'risa', 'risi', 'rise', 'ridendo',

  // PIANGERE
  'piangere', 'piango', 'piangi', 'piange', 'piangiamo', 'piangete', 'piangono', 'piangevo', 'piangevi', 'piangeva', 'piangevamo', 'piangevate', 'piangevano',
  'piansi', 'piangesti', 'pianse', 'piangemmo', 'piangeste', 'piansero', 'piangerò', 'piangerai', 'piangerà', 'piangeremo', 'piangerete', 'piangeranno',
  'pianga', 'piangano', 'piangessi', 'piangesse', 'piangessimo', 'piangeste', 'piangessero',
  'piangerei', 'piangeresti', 'piangerebbe', 'piangeremmo', 'piangereste', 'piangerebbero',
  'pianto', 'pianta', 'pianti', 'piante', 'piangendo',

  // SORRIDERE
  'sorridere', 'sorrido', 'sorridi', 'sorride', 'sorridiamo', 'sorridete', 'sorridono', 'sorridevo', 'sorridevi', 'sorrideva', 'sorridevamo', 'sorridevate', 'sorridevano',
  'sorrisi', 'sorridesti', 'sorrise', 'sorridemmo', 'sorrideste', 'sorrisero', 'sorriderò', 'sorriderai', 'sorriderà', 'sorrideremo', 'sorriderete', 'sorrideranno',
  'sorrida', 'sorridano', 'sorridessi', 'sorridesse', 'sorridessimo', 'sorrideste', 'sorridessero',
  'sorriderei', 'sorrideresti', 'sorriderebbe', 'sorrideremmo', 'sorridereste', 'sorriderebbero',
  'sorriso', 'sorrisa', 'sorrisi', 'sorrise', 'sorridendo',

  // SOGNARE
  'sognare', 'sogno', 'sogni', 'sogna', 'sogniamo', 'sognate', 'sognano', 'sognavo', 'sognavi', 'sognava', 'sognavamo', 'sognavate', 'sognavano',
  'sognai', 'sognasti', 'sognò', 'sognammo', 'sognaste', 'sognarono', 'sognerò', 'sognerai', 'sognerà', 'sogneremo', 'sognerete', 'sogneranno',
  'sogni', 'sognino', 'sognassi', 'sognasse', 'sognassimo', 'sognaste', 'sognassero',
  'sognerei', 'sogneresti', 'sognerebbe', 'sogneremmo', 'sognereste', 'sognerebbero',
  'sognato', 'sognata', 'sognati', 'sognate', 'sognando',

  // SPERARE
  'sperare', 'spero', 'speri', 'spera', 'speriamo', 'sperate', 'sperano', 'speravo', 'speravi', 'sperava', 'speravamo', 'speravate', 'speravano',
  'sperai', 'sperasti', 'sperò', 'sperammo', 'speraste', 'sperarono', 'spererò', 'spererai', 'spererà', 'spereremo', 'spererete', 'spereranno',
  'speri', 'sperino', 'sperassi', 'sperasse', 'sperassimo', 'speraste', 'sperassero',
  'spererei', 'spereresti', 'spererebbe', 'spereremmo', 'sperereste', 'spererebbero',
  'sperato', 'sperata', 'sperati', 'sperate', 'sperando',

  // TEMERE
  'temere', 'temo', 'temi', 'teme', 'temiamo', 'temete', 'temono', 'temevo', 'temevi', 'temeva', 'temevamo', 'temevate', 'temevano',
  'temei', 'temesti', 'temette', 'tememmo', 'temeste', 'temettero', 'temerò', 'temerai', 'temerà', 'temeremo', 'temerete', 'temeranno',
  'tema', 'temano', 'temessi', 'temesse', 'temessimo', 'temeste', 'temessero',
  'temerei', 'temeresti', 'temerebbe', 'temeremmo', 'temereste', 'temerebbero',
  'temuto', 'temuta', 'temuti', 'temute', 'temendo',

  // RICORDARE
  'ricordare', 'ricordo', 'ricordi', 'ricorda', 'ricordiamo', 'ricordate', 'ricordano', 'ricordavo', 'ricordavi', 'ricordava', 'ricordavamo', 'ricordavate', 'ricordavano',
  'ricordai', 'ricordasti', 'ricordò', 'ricordammo', 'ricordaste', 'ricordarono', 'ricorderò', 'ricorderai', 'ricorderà', 'ricorderemo', 'ricorderete', 'ricorderanno',
  'ricordi', 'ricordino', 'ricordassi', 'ricordasse', 'ricordassimo', 'ricordaste', 'ricordassero',
  'ricorderei', 'ricorderesti', 'ricorderebbe', 'ricorderemmo', 'ricordereste', 'ricorderebbero',
  'ricordato', 'ricordata', 'ricordati', 'ricordate', 'ricordando',

  // DIMENTICARE
  'dimenticare', 'dimentico', 'dimentichi', 'dimentica', 'dimentichiamo', 'dimenticate', 'dimenticano', 'dimenticavo', 'dimenticavi', 'dimenticava', 'dimenticavamo', 'dimenticavate', 'dimenticavano',
  'dimenticai', 'dimenticasti', 'dimenticò', 'dimenticammo', 'dimenticaste', 'dimenticarono', 'dimenticherò', 'dimenticherai', 'dimenticherà', 'dimenticheremo', 'dimenticherete', 'dimenticheranno',
  'dimentichi', 'dimentichino', 'dimenticassi', 'dimenticasse', 'dimenticassimo', 'dimenticaste', 'dimenticassero',
  'dimenticherei', 'dimenticheresti', 'dimenticherebbe', 'dimenticheremmo', 'dimentichereste', 'dimenticherebbero',
  'dimenticato', 'dimenticata', 'dimenticati', 'dimenticate', 'dimenticando',

  // IMPARARE
  'imparare', 'imparo', 'impari', 'impara', 'impariamo', 'imparate', 'imparano', 'imparavo', 'imparavi', 'imparava', 'imparavamo', 'imparavate', 'imparavano',
  'imparai', 'imparasti', 'imparò', 'imparammo', 'imparaste', 'impararono', 'imparerò', 'imparerai', 'imparerà', 'impareremo', 'imparerete', 'impareranno',
  'impari', 'imparino', 'imparassi', 'imparasse', 'imparassimo', 'imparaste', 'imparassero',
  'imparerei', 'impareresti', 'imparerebbe', 'impareremmo', 'imparereste', 'imparerebbero',
  'imparato', 'imparata', 'imparati', 'imparate', 'imparando',

  // INSEGNARE
  'insegnare', 'insegno', 'insegni', 'insegna', 'insegniamo', 'insegnate', 'insegnano', 'insegnavo', 'insegnavi', 'insegnava', 'insegnavamo', 'insegnavate', 'insegnavano',
  'insegnai', 'insegnasti', 'insegnò', 'insegnammo', 'insegnaste', 'insegnarono', 'insegnerò', 'insegnerai', 'insegnerà', 'insegneremo', 'insegnerete', 'insegneranno',
  'insegni', 'insegnino', 'insegnassi', 'insegnasse', 'insegnassimo', 'insegnaste', 'insegnassero',
  'insegnerei', 'insegneresti', 'insegnerebbe', 'insegneremmo', 'insegnereste', 'insegnerebbero',
  'insegnato', 'insegnata', 'insegnati', 'insegnate', 'insegnando',

  // STUDIARE
  'studiare', 'studio', 'studi', 'studia', 'studiamo', 'studiate', 'studiano', 'studiavo', 'studiavi', 'studiava', 'studiavamo', 'studiavate', 'studiavano',
  'studiai', 'studiasti', 'studiò', 'studiammo', 'studiaste', 'studiarono', 'studierò', 'studierai', 'studierà', 'studieremo', 'studierete', 'studieranno',
  'studi', 'studino', 'studiassi', 'studiasse', 'studiassimo', 'studiaste', 'studiassero',
  'studierei', 'studieresti', 'studierebbe', 'studieremmo', 'studiereste', 'studierebbero',
  'studiato', 'studiata', 'studiati', 'studiate', 'studiando',

  // LEGGERE
  'leggere', 'leggo', 'leggi', 'legge', 'leggiamo', 'leggete', 'leggono', 'leggevo', 'leggevi', 'leggeva', 'leggevamo', 'leggevate', 'leggevano',
  'lessi', 'leggesti', 'lesse', 'leggemmo', 'leggeste', 'lessero', 'leggerò', 'leggerai', 'leggerà', 'leggeremo', 'leggerete', 'leggeranno',
  'legga', 'leggano', 'leggessi', 'leggesse', 'leggessimo', 'leggeste', 'leggessero',
  'leggerei', 'leggeresti', 'leggerebbe', 'leggeremmo', 'leggereste', 'leggerebbero',
  'letto', 'letta', 'letti', 'lette', 'leggendo',

  // SCRIVERE
  'scrivere', 'scrivo', 'scrivi', 'scrive', 'scriviamo', 'scrivete', 'scrivono', 'scrivevo', 'scrivevi', 'scriveva', 'scrivevamo', 'scrivevate', 'scrivevano',
  'scrissi', 'scrivesti', 'scrisse', 'scrivemmo', 'scriveste', 'scrissero', 'scriverò', 'scriverai', 'scriverà', 'scriveremo', 'scriverete', 'scriveranno',
  'scriva', 'scrivano', 'scrivessi', 'scrivesse', 'scrivessimo', 'scriveste', 'scrivessero',
  'scriverei', 'scriveresti', 'scriverebbe', 'scriveremmo', 'scrivereste', 'scriverebbero',
  'scritto', 'scritta', 'scritti', 'scritte', 'scrivendo',

  // DISEGNARE
  'disegnare', 'disegno', 'disegni', 'disegna', 'disegniamo', 'disegnate', 'disegnano', 'disegnavo', 'disegnavi', 'disegnava', 'disegnavamo', 'disegnavate', 'disegnavano',
  'disegnai', 'disegnasti', 'disegnò', 'disegnammo', 'disegnaste', 'disegnarono', 'disegnerò', 'disegnerai', 'disegnerà', 'disegneremo', 'disegnerete', 'disegneranno',
  'disegni', 'disegnino', 'disegnassi', 'disegnasse', 'disegnassimo', 'disegnaste', 'disegnassero',
  'disegnerei', 'disegneresti', 'disegnerebbe', 'disegneremmo', 'disegnereste', 'disegnerebbero',
  'disegnato', 'disegnata', 'disegnati', 'disegnate', 'disegnando',

  // CANTARE
  'cantare', 'canto', 'canti', 'canta', 'cantiamo', 'cantate', 'cantano', 'cantavo', 'cantavi', 'cantava', 'cantavamo', 'cantavate', 'cantavano',
  'cantai', 'cantasti', 'cantò', 'cantammo', 'cantaste', 'cantarono', 'canterò', 'canterai', 'canterà', 'canteremo', 'canterete', 'canteranno',
  'canti', 'cantino', 'cantassi', 'cantasse', 'cantassimo', 'cantaste', 'cantassero',
  'canterei', 'canteresti', 'canterebbe', 'canteremmo', 'cantereste', 'canterebbero',
  'cantato', 'cantata', 'cantati', 'cantate', 'cantando',

  // BALLARE
  'ballare', 'ballo', 'balli', 'balla', 'balliamo', 'ballate', 'ballano', 'ballavo', 'ballavi', 'ballava', 'ballavamo', 'ballavate', 'ballavano',
  'ballai', 'ballasti', 'ballò', 'ballammo', 'ballaste', 'ballarono', 'ballerò', 'ballerai', 'ballerà', 'balleremo', 'ballerete', 'balleranno',
  'balli', 'ballino', 'ballassi', 'ballasse', 'ballassimo', 'ballaste', 'ballassero',
  'ballerei', 'balleresti', 'ballerebbe', 'balleremmo', 'ballereste', 'ballerebbero',
  'ballato', 'ballata', 'ballati', 'ballate', 'ballando',

  // SUONARE
  'suonare', 'suono', 'suoni', 'suona', 'suoniamo', 'suonate', 'suonano', 'suonavo', 'suonavi', 'suonava', 'suonavamo', 'suonavate', 'suonavano',
  'suonai', 'suonasti', 'suonò', 'suonammo', 'suonaste', 'suonarono', 'suonerò', 'suonerai', 'suonerà', 'suoneremo', 'suonerete', 'suoneranno',
  'suoni', 'suonino', 'suonassi', 'suonasse', 'suonassimo', 'suonaste', 'suonassero',
  'suonerei', 'suoneresti', 'suonerebbe', 'suoneremmo', 'suonereste', 'suonerebbero',
  'suonato', 'suonata', 'suonati', 'suonate', 'suonando',

  // VIAGGIARE
  'viaggiare', 'viaggio', 'viaggi', 'viaggia', 'viaggiamo', 'viaggiate', 'viaggiano', 'viaggiavo', 'viaggiavi', 'viaggiava', 'viaggiavamo', 'viaggiavate', 'viaggiavano',
  'viaggiai', 'viaggiasti', 'viaggiò', 'viaggiammo', 'viaggiaste', 'viaggiarono', 'viaggerò', 'viaggerai', 'viaggerà', 'viaggeremo', 'viaggerete', 'viaggeranno',
  'viaggi', 'viaggino', 'viaggiassi', 'viaggiasse', 'viaggiassimo', 'viaggiaste', 'viaggiassero',
  'viaggerei', 'viaggeresti', 'viaggerebbe', 'viaggeremmo', 'viaggereste', 'viaggerebbero',
  'viaggiato', 'viaggiata', 'viaggiati', 'viaggiate', 'viaggiando',

  // GUIDARE
  'guidare', 'guido', 'guidi', 'guida', 'guidiamo', 'guidate', 'guidano', 'guidavo', 'guidavi', 'guidava', 'guidavamo', 'guidavate', 'guidavano',
  'guidai', 'guidasti', 'guidò', 'guidammo', 'guidaste', 'guidarono', 'guiderò', 'guiderai', 'guiderà', 'guideremo', 'guiderete', 'guideranno',
  'guidi', 'guidino', 'guidassi', 'guidasse', 'guidassimo', 'guidaste', 'guidassero',
  'guiderei', 'guideresti', 'guiderebbe', 'guideremmo', 'guidereste', 'guiderebbero',
  'guidato', 'guidata', 'guidati', 'guidate', 'guidando',

  // VOLARE
  'volare', 'volo', 'voli', 'vola', 'voliamo', 'volate', 'volano', 'volavo', 'volavi', 'volava', 'volavamo', 'volavate', 'volavano',
  'volai', 'volasti', 'volò', 'volammo', 'volaste', 'volarono', 'volerò', 'volerai', 'volerà', 'voleremo', 'volerete', 'voleranno',
  'voli', 'volino', 'volassi', 'volasse', 'volassimo', 'volaste', 'volassero',
  'volerei', 'voleresti', 'volerebbe', 'voleremmo', 'volereste', 'volerebbero',
  'volato', 'volata', 'volati', 'volate', 'volando',

  // NUOTARE
  'nuotare', 'nuoto', 'nuoti', 'nuota', 'nuotiamo', 'nuotate', 'nuotano', 'nuotavo', 'nuotavi', 'nuotava', 'nuotavamo', 'nuotavate', 'nuotavano',
  'nuotai', 'nuotasti', 'nuotò', 'nuotammo', 'nuotaste', 'nuotarono', 'nuoterò', 'nuoterai', 'nuoterà', 'nuoteremo', 'nuoterete', 'nuoteranno',
  'nuoti', 'nuotino', 'nuotassi', 'nuotasse', 'nuotassimo', 'nuotaste', 'nuotassero',
  'nuoterei', 'nuoteresti', 'nuoterebbe', 'nuoteremmo', 'nuotereste', 'nuoterebbero',
  'nuotato', 'nuotata', 'nuotati', 'nuotate', 'nuotando',

  // CORRERE
  'correre', 'corro', 'corri', 'corre', 'corriamo', 'correte', 'corrono', 'correvo', 'correvi', 'correva', 'correvamo', 'correvate', 'correvano',
  'corsi', 'corresti', 'corse', 'corremmo', 'correste', 'corsero', 'correrò', 'correrai', 'correrà', 'correremo', 'correrete', 'correranno',
  'corra', 'corrano', 'corressi', 'corresse', 'corressimo', 'correste', 'corressero',
  'correrei', 'correresti', 'correrebbe', 'correremmo', 'correreste', 'correrebbero',
  'corso', 'corsa', 'corsi', 'corse', 'correndo',

  // SALIRE
  'salire', 'salgo', 'sali', 'sale', 'saliamo', 'salite', 'salgono', 'salivo', 'salivi', 'saliva', 'salivamo', 'salivate', 'salivano',
  'salii', 'salisti', 'salì', 'salimmo', 'saliste', 'salirono', 'salirò', 'salirai', 'salirà', 'saliremo', 'salirete', 'saliranno',
  'salga', 'salgano', 'salissi', 'salisse', 'salissimo', 'saliste', 'salissero',
  'salirei', 'saliresti', 'salirebbe', 'saliremmo', 'salireste', 'salirebbero',
  'salito', 'salita', 'saliti', 'salite', 'salendo',

  // SCENDERE
  'scendere', 'scendo', 'scendi', 'scende', 'scendiamo', 'scendete', 'scendono', 'scendevo', 'scendevi', 'scendeva', 'scendevamo', 'scendevate', 'scendevano',
  'scesi', 'scendesti', 'scese', 'scendemmo', 'scendeste', 'scesero', 'scenderò', 'scenderai', 'scenderà', 'scenderemo', 'scenderete', 'scenderanno',
  'scenda', 'scendano', 'scendessi', 'scendesse', 'scendessimo', 'scendeste', 'scendessero',
  'scenderei', 'scenderesti', 'scenderebbe', 'scenderemmo', 'scendereste', 'scenderebbero',
  'sceso', 'scesa', 'scesi', 'scese', 'scendendo',

  // COMPRARE
  'comprare', 'compro', 'compri', 'compra', 'compriamo', 'comprate', 'comprano', 'compravo', 'compravi', 'comprava', 'compravamo', 'compravate', 'compravano',
  'comprai', 'comprasti', 'comprò', 'comprammo', 'compraste', 'comprarono', 'comprerò', 'comprerai', 'comprerà', 'compreremo', 'comprerete', 'compreranno',
  'compri', 'comprino', 'comprassi', 'comprasse', 'comprassimo', 'compraste', 'comprassero',
  'comprerei', 'compreresti', 'comprerebbe', 'compreremmo', 'comprereste', 'comprerebbero',
  'comprato', 'comprata', 'comprati', 'comprate', 'comprando',

  // VENDERE
  'vendere', 'vendo', 'vendi', 'vende', 'vendiamo', 'vendete', 'vendono', 'vendevo', 'vendevi', 'vendeva', 'vendevamo', 'vendevate', 'vendevano',
  'vendei', 'vendesti', 'vendette', 'vendemmo', 'vendeste', 'vendettero', 'venderò', 'venderai', 'venderà', 'venderemo', 'venderete', 'venderanno',
  'venda', 'vendano', 'vendessi', 'vendesse', 'vendessimo', 'vendeste', 'vendessero',
  'venderei', 'venderesti', 'venderebbe', 'venderemmo', 'vendereste', 'venderebbero',
  'venduto', 'venduta', 'venduti', 'vendute', 'vendendo',

  // PAGARE
  'pagare', 'pago', 'paghi', 'paga', 'paghiamo', 'pagate', 'pagano', 'pagavo', 'pagavi', 'pagava', 'pagavamo', 'pagavate', 'pagavano',
  'pagai', 'pagasti', 'pagò', 'pagammo', 'pagaste', 'pagarono', 'pagherò', 'pagherai', 'pagherà', 'pagheremo', 'pagherete', 'pagheranno',
  'paghi', 'paghino', 'pagassi', 'pagasse', 'pagassimo', 'pagaste', 'pagassero',
  'pagherei', 'pagheresti', 'pagherebbe', 'pagheremmo', 'paghereste', 'pagherebbero',
  'pagato', 'pagata', 'pagati', 'pagate', 'pagando',

  // SPENDERE
  'spendere', 'spendo', 'spendi', 'spende', 'spendiamo', 'spendete', 'spendono', 'spendevo', 'spendevi', 'spendeva', 'spendevamo', 'spendevate', 'spendevano',
  'spesi', 'spendesti', 'spese', 'spendemmo', 'spendeste', 'spesero', 'spenderò', 'spenderai', 'spenderà', 'spenderemo', 'spenderete', 'spenderanno',
  'spenda', 'spendano', 'spendessi', 'spendesse', 'spendessimo', 'spendeste', 'spendessero',
  'spenderei', 'spenderesti', 'spenderebbe', 'spenderemmo', 'spendereste', 'spenderebbero',
  'speso', 'spesa', 'spesi', 'spese', 'spendendo',

  // OFFRIRE
  'offrire', 'offro', 'offri', 'offre', 'offriamo', 'offrite', 'offrono', 'offrivo', 'offrivi', 'offriva', 'offrivamo', 'offrivate', 'offrivano',
  'offrii', 'offristi', 'offrì', 'offrimmo', 'offriste', 'offrirono', 'offrirò', 'offrirai', 'offrirà', 'offriremo', 'offrirete', 'offriranno',
  'offra', 'offrano', 'offrissi', 'offrisse', 'offrissimo', 'offriste', 'offrissero',
  'offrirei', 'offriresti', 'offrirebbe', 'offriremmo', 'offrireste', 'offrirebbero',
  'offerto', 'offerta', 'offerti', 'offerte', 'offrendo',

  // RICEVERE
  'ricevere', 'ricevo', 'ricevi', 'riceve', 'riceviamo', 'ricevete', 'ricevono', 'ricevevo', 'ricevevi', 'riceveva', 'ricevevamo', 'ricevevate', 'ricevevano',
  'ricevei', 'ricevesti', 'ricevette', 'ricevemmo', 'riceveste', 'ricevettero', 'riceverò', 'riceverai', 'riceverà', 'riceveremo', 'riceverete', 'riceveranno',
  'riceva', 'ricevano', 'ricevessi', 'ricevesse', 'ricevessimo', 'riceveste', 'ricevessero',
  'riceverei', 'riceveresti', 'riceverebbe', 'riceveremmo', 'ricevereste', 'riceverebbero',
  'ricevuto', 'ricevuta', 'ricevuti', 'ricevute', 'ricevendo',

  // DARE
  'dare', 'do', 'dai', 'dà', 'diamo', 'date', 'danno', 'davo', 'davi', 'dava', 'davamo', 'davate', 'davano',
  'diedi', 'desti', 'diede', 'demmo', 'deste', 'diedero', 'darò', 'darai', 'darà', 'daremo', 'darete', 'daranno',
  'dia', 'diano', 'dessi', 'desse', 'dessimo', 'deste', 'dessero',
  'darei', 'daresti', 'darebbe', 'daremmo', 'dareste', 'darebbero',
  'dato', 'data', 'dati', 'date', 'dando',

  // PRENDERE
  'prendere', 'prendo', 'prendi', 'prende', 'prendiamo', 'prendete', 'prendono', 'prendevo', 'prendevi', 'prendeva', 'prendevamo', 'prendevate', 'prendevano',
  'presi', 'prendesti', 'prese', 'prendemmo', 'prendeste', 'presero', 'prenderò', 'prenderai', 'prenderà', 'prenderemo', 'prenderete', 'prenderanno',
  'prenda', 'prendano', 'prendessi', 'prendesse', 'prendessimo', 'prendeste', 'prendessero',
  'prenderei', 'prenderesti', 'prenderebbe', 'prenderemmo', 'prendereste', 'prenderebbero',
  'preso', 'presa', 'presi', 'prese', 'prendendo',

  // RUBARE
  'rubare', 'rubo', 'rubi', 'ruba', 'rubiamo', 'rubate', 'rubano', 'rubavo', 'rubavi', 'rubava', 'rubavamo', 'rubavate', 'rubavano',
  'rubai', 'rubasti', 'rubò', 'rubammo', 'rubaste', 'rubarono', 'ruberò', 'ruberai', 'ruberà', 'ruberemo', 'ruberete', 'ruberanno',
  'rubi', 'rubino', 'rubassi', 'rubasse', 'rubassimo', 'rubaste', 'rubassero',
  'ruberei', 'ruberesti', 'ruberebbe', 'ruberemmo', 'rubereste', 'ruberebbero',
  'rubato', 'rubata', 'rubati', 'rubate', 'rubando',

  // UCCIDERE
  'uccidere', 'uccido', 'uccidi', 'uccide', 'uccidiamo', 'uccidete', 'uccidono', 'uccidevo', 'uccidevi', 'uccideva', 'uccidevamo', 'uccidevate', 'uccidevano',
  'uccisi', 'uccidesti', 'uccise', 'uccidemmo', 'uccideste', 'uccisero', 'ucciderò', 'ucciderai', 'ucciderà', 'uccideremo', 'ucciderete', 'uccideranno',
  'uccida', 'uccidano', 'uccidessi', 'uccidesse', 'uccidessimo', 'uccideste', 'uccidessero',
  'ucciderei', 'uccideresti', 'ucciderebbe', 'uccideremmo', 'uccidereste', 'ucciderebbero',
  'ucciso', 'uccisa', 'uccisi', 'uccise', 'uccidendo',

  // FERIRE
  'ferire', 'ferisco', 'ferisci', 'ferisce', 'feriamo', 'ferite', 'feriscono', 'ferivo', 'ferivi', 'feriva', 'ferivamo', 'ferivate', 'ferivano',
  'ferii', 'feristi', 'ferì', 'ferimmo', 'feriste', 'ferirono', 'ferirò', 'ferirai', 'ferirà', 'feriremo', 'ferirete', 'feriranno',
  'ferisca', 'feriscano', 'ferissi', 'ferisse', 'ferissimo', 'feriste', 'ferissero',
  'ferirei', 'feriresti', 'ferirebbe', 'feriremmo', 'ferireste', 'ferirebbero',
  'ferito', 'ferita', 'feriti', 'ferite', 'ferendo',

  // CURARE
  'curare', 'curo', 'curi', 'cura', 'curiamo', 'curate', 'curano', 'curavo', 'curavi', 'curava', 'curavamo', 'curavate', 'curavano',
  'curai', 'curasti', 'curò', 'curammo', 'curaste', 'curarono', 'curerò', 'curerai', 'curerà', 'cureremo', 'curerete', 'cureranno',
  'curi', 'curino', 'curassi', 'curasse', 'curassimo', 'curaste', 'curassero',
  'curerei', 'cureresti', 'curerebbe', 'cureremmo', 'curereste', 'curerebbero',
  'curato', 'curata', 'curati', 'curate', 'curando',

  // SALVARE
  'salvare', 'salvo', 'salvi', 'salva', 'salviamo', 'salvate', 'salvano', 'salvavo', 'salvavi', 'salvava', 'salvavamo', 'salvavate', 'salvavano',
  'salvai', 'salvasti', 'salvò', 'salvammo', 'salvaste', 'salvarono', 'salverò', 'salverai', 'salverà', 'salveremo', 'salverete', 'salveranno',
  'salvi', 'salvino', 'salvassi', 'salvasse', 'salvassimo', 'salvaste', 'salvassero',
  'salverei', 'salveresti', 'salverebbe', 'salveremmo', 'salvereste', 'salverebbero',
  'salvato', 'salvata', 'salvati', 'salvate', 'salvando',

  // AIUTARE
  'aiutare', 'aiuto', 'aiuti', 'aiuta', 'aiutiamo', 'aiutate', 'aiutano', 'aiutavo', 'aiutavi', 'aiutava', 'aiutavamo', 'aiutavate', 'aiutavano',
  'aiutai', 'aiutasti', 'aiutò', 'aiutammo', 'aiutaste', 'aiutarono', 'aiuterò', 'aiuterai', 'aiuterà', 'aiuteremo', 'aiuterete', 'aiuteranno',
  'aiuti', 'aiutino', 'aiutassi', 'aiutasse', 'aiutassimo', 'aiutaste', 'aiutassero',
  'aiuterei', 'aiuteresti', 'aiuterebbe', 'aiuteremmo', 'aiutereste', 'aiuterebbero',
  'aiutato', 'aiutata', 'aiutati', 'aiutate', 'aiutando',

  // SERVIRE
  'servire', 'servo', 'servi', 'serve', 'serviamo', 'servite', 'servono', 'servivo', 'servivi', 'serviva', 'servivamo', 'servivate', 'servivano',
  'servii', 'servisti', 'servì', 'servimmo', 'serviste', 'servirono', 'servirò', 'servirai', 'servirà', 'serviremo', 'servirete', 'serviranno',
  'serva', 'servano', 'servissi', 'servisse', 'servissimo', 'serviste', 'servissero',
  'servirei', 'serviresti', 'servirebbe', 'serviremmo', 'servireste', 'servirebbero',
  'servito', 'servita', 'serviti', 'servite', 'servendo',

  // USARE
  'usare', 'uso', 'usi', 'usa', 'usiamo', 'usate', 'usano', 'usavo', 'usavi', 'usava', 'usavamo', 'usavate', 'usavano',
  'usai', 'usasti', 'usò', 'usammo', 'usaste', 'usarono', 'userò', 'userai', 'userà', 'useremo', 'userete', 'useranno',
  'usi', 'usino', 'usassi', 'usasse', 'usassimo', 'usaste', 'usassero',
  'userei', 'useresti', 'userebbe', 'useremmo', 'usereste', 'userebbero',
  'usato', 'usata', 'usati', 'usate', 'usando',

  // GETTARE
  'gettare', 'getto', 'getti', 'getta', 'gettiamo', 'gettate', 'gettano', 'gettavo', 'gettavi', 'gettava', 'gettavamo', 'gettavate', 'gettavano',
  'gettai', 'gettasti', 'gettò', 'gettammo', 'gettaste', 'gettarono', 'getterò', 'getterai', 'getterà', 'getteremo', 'getterete', 'getteranno',
  'getti', 'gettino', 'gettassi', 'gettasse', 'gettassimo', 'gettaste', 'gettassero',
  'getterei', 'getteresti', 'getterebbe', 'getteremmo', 'gettereste', 'getterebbero',
  'gettato', 'gettata', 'gettati', 'gettate', 'gettando',

  // TIRARE
  'tirare', 'tiro', 'tiri', 'tira', 'tiriamo', 'tirate', 'tirano', 'tiravo', 'tiravi', 'tirava', 'tiravamo', 'tiravate', 'tiravano',
  'tirai', 'tirasti', 'tirò', 'tirammo', 'tiraste', 'tirarono', 'tirerò', 'tirerai', 'tirerà', 'tireremo', 'tirerete', 'tireranno',
  'tiri', 'tirino', 'tirassi', 'tirasse', 'tirassimo', 'tiraste', 'tirassero',
  'tirerei', 'tireresti', 'tirerebbe', 'tireremmo', 'tirereste', 'tirerebbero',
  'tirato', 'tirata', 'tirati', 'tirate', 'tirando',

  // SPINGERE
  'spingere', 'spingo', 'spingi', 'spinge', 'spingiamo', 'spingete', 'spingono', 'spingevo', 'spingevi', 'spingeva', 'spingevamo', 'spingevate', 'spingevano',
  'spinsi', 'spingesti', 'spinse', 'spingemmo', 'spingeste', 'spinsero', 'spingerò', 'spingerai', 'spingerà', 'spingeremo', 'spingerete', 'spingeranno',
  'spinga', 'spingano', 'spingessi', 'spingesse', 'spingessimo', 'spingeste', 'spingessero',
  'spingerei', 'spingeresti', 'spingerebbe', 'spingeremmo', 'spingereste', 'spingerebbero',
  'spinto', 'spinta', 'spinti', 'spinte', 'spingendo',

  // ALZARE
  'alzare', 'alzo', 'alzi', 'alza', 'alziamo', 'alzate', 'alzano', 'alzavo', 'alzavi', 'alzava', 'alzavamo', 'alzavate', 'alzavano',
  'alzai', 'alzasti', 'alzò', 'alzammo', 'alzaste', 'alzarono', 'alzerò', 'alzerai', 'alzerà', 'alzeremo', 'alzerete', 'alzeranno',
  'alzi', 'alzino', 'alzassi', 'alzasse', 'alzassimo', 'alzaste', 'alzassero',
  'alzerei', 'alzeresti', 'alzerebbe', 'alzeremmo', 'alzereste', 'alzerebbero',
  'alzato', 'alzata', 'alzati', 'alzate', 'alzando',

  // ABBASSARE
  'abbassare', 'abbasso', 'abbassi', 'abbassa', 'abbassiamo', 'abbassate', 'abbassano', 'abbassavo', 'abbassavi', 'abbassava', 'abbassavamo', 'abbassavate', 'abbassavano',
  'abbassai', 'abbassasti', 'abbassò', 'abbassammo', 'abbassaste', 'abbassarono', 'abbasserò', 'abbasserai', 'abbasserà', 'abbasseremo', 'abbasserete', 'abbasseranno',
  'abbassi', 'abbassino', 'abbassassi', 'abbassasse', 'abbassassimo', 'abbassaste', 'abbassassero',
  'abbasserei', 'abbasseresti', 'abbasserebbe', 'abbasseremmo', 'abbassereste', 'abbasserebbero',
  'abbassato', 'abbassata', 'abbassati', 'abbassate', 'abbassando',

  // APRIRE
  'aprire', 'apro', 'apri', 'apre', 'apriamo', 'aprite', 'aprono', 'aprivo', 'aprivi', 'apriva', 'aprivamo', 'aprivate', 'aprivano',
  'aprii', 'apristi', 'aprì', 'aprimmo', 'apriste', 'aprirono', 'aprirò', 'aprirai', 'aprirà', 'apriremo', 'aprirete', 'apriranno',
  'apra', 'aprano', 'aprissi', 'aprisse', 'aprissimo', 'apriste', 'aprissero',
  'aprirei', 'apriresti', 'aprirebbe', 'apriremmo', 'aprireste', 'aprirebbero',
  'aperto', 'aperta', 'aperti', 'aperte', 'aprendo',

  // CHIUDERE
  'chiudere', 'chiudo', 'chiudi', 'chiude', 'chiudiamo', 'chiudete', 'chiudono', 'chiudevo', 'chiudevi', 'chiudeva', 'chiudevamo', 'chiudevate', 'chiudevano',
  'chiusi', 'chiudesti', 'chiuse', 'chiudemmo', 'chiudeste', 'chiusero', 'chiuderò', 'chiuderai', 'chiuderà', 'chiuderemo', 'chiuderete', 'chiuderanno',
  'chiuda', 'chiudano', 'chiudessi', 'chiudesse', 'chiudessimo', 'chiudeste', 'chiudessero',
  'chiuderei', 'chiuderesti', 'chiuderebbe', 'chiuderemmo', 'chiudereste', 'chiuderebbero',
  'chiuso', 'chiusa', 'chiusi', 'chiuse', 'chiudendo',

  // ACCENDERE
  'accendere', 'accendo', 'accendi', 'accende', 'accendiamo', 'accendete', 'accendono', 'accendevo', 'accendevi', 'accendeva', 'accendevamo', 'accendevate', 'accendevano',
  'accesi', 'accendesti', 'accese', 'accendemmo', 'accendeste', 'accesero', 'accenderò', 'accenderai', 'accenderà', 'accenderemo', 'accenderete', 'accenderanno',
  'accenda', 'accendano', 'accendessi', 'accendesse', 'accendessimo', 'accendeste', 'accendessero',
  'accenderei', 'accenderesti', 'accenderebbe', 'accenderemmo', 'accendereste', 'accenderebbero',
  'acceso', 'accesa', 'accesi', 'accese', 'accendendo',

  // SPEGNERE
  'spegnere', 'spengo', 'spegni', 'spegne', 'spegniamo', 'spegnete', 'spengono', 'spegnevo', 'spegnevi', 'spegneva', 'spegnevamo', 'spegnevate', 'spegnevano',
  'spensi', 'spegnesti', 'spense', 'spegnemmo', 'spegneste', 'spensero', 'spegnerò', 'spegnerai', 'spegnerà', 'spegneremo', 'spegnerete', 'spegneranno',
  'spenga', 'spengano', 'spegnessi', 'spegnesse', 'spegnessimo', 'spegneste', 'spegnessero',
  'spegnerei', 'spegneresti', 'spegnerebbe', 'spegneremmo', 'spegnereste', 'spegnerebbero',
  'spento', 'spenta', 'spenti', 'spente', 'spegnendo'
]);
