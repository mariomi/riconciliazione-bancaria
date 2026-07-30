(function (global) {
  'use strict';

  /*
   * Dataset dimostrativo interamente sintetico.
   * Aziende, banche, descrizioni, documenti e importi non si riferiscono a
   * persone o rapporti bancari reali.
   */

  const PARTITARIO_SOURCE = 'Partitario DEMO Azienda Esempio S.r.l.';
  const ESTRATTO_SOURCE = 'Banca Esempio Italiana (DEMO)';
  const PARTITARIO_FILE = 'DEMO_partitario_luglio_2026.pdf';
  const ESTRATTO_FILE = 'DEMO_estratto_conto_luglio_2026.pdf';

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function partitario(date, dateValuta, description, dare, avere) {
    return {
      type: 'partitario',
      date,
      dateValuta,
      description,
      dare,
      avere,
      amount: dare - avere,
      source: PARTITARIO_SOURCE,
      bank: 'partitario-demo',
      fileName: PARTITARIO_FILE,
      codConto: 'DEMO-001',
      ditta: 'Azienda Esempio S.r.l. (DEMO)'
    };
  }

  function estratto(date, dateValuta, description, dare, avere) {
    return {
      type: 'estratto',
      date,
      dateValuta,
      description,
      dare,
      avere,
      amount: avere - dare,
      source: ESTRATTO_SOURCE,
      bank: 'banca-demo',
      fileName: ESTRATTO_FILE
    };
  }

  const LIVE_DATA = {
    analysisName: 'DEMO · Riconciliazione luglio 2026',
    partitarioFileName: PARTITARIO_FILE,
    estrattoFileName: ESTRATTO_FILE,
    pm: [
      partitario(
        '01/07/2026',
        '01/07/2026',
        'PAGAMENTO FORNITORE DEMO ALFA SRL FATTURA D-1001',
        0,
        1240
      ),
      partitario(
        '03/07/2026',
        '03/07/2026',
        'INCASSO CLIENTE DEMO BETA SPA FATTURA D-2048',
        3650,
        0
      ),
      partitario(
        '06/07/2026',
        '06/07/2026',
        'ADDEBITO UTENZA ELETTRICA SEDE DEMO',
        0,
        89.5
      ),
      partitario(
        '16/07/2026',
        '16/07/2026',
        'BONIFICO FORNITORE DEMO GAMMA SNC FATTURA D-071',
        0,
        722.8
      ),
      partitario(
        '22/07/2026',
        '22/07/2026',
        'INCASSO CLIENTE DEMO DELTA SRL FATTURA D-330',
        1464,
        0
      ),
      partitario(
        '29/07/2026',
        '29/07/2026',
        'VERSAMENTO F24 DEMO RITENUTE MESE DI GIUGNO',
        0,
        246.4
      ),
      partitario(
        '24/07/2026',
        '24/07/2026',
        'CANONE LOCAZIONE UFFICIO DEMO LUGLIO',
        0,
        2100
      ),
      partitario(
        '21/07/2026',
        '21/07/2026',
        'COMMISSIONI SERVIZIO POS DEMO LUGLIO',
        0,
        400
      ),
      partitario(
        '23/07/2026',
        '23/07/2026',
        'INCASSO BONIFICO CLIENTE DEMO LAGO SRL',
        1000,
        0
      ),
      partitario(
        '28/07/2026',
        '28/07/2026',
        'FATTURA DA PAGARE FORNITORE DEMO ZETA SRL',
        0,
        173.2
      )
    ],
    em: [
      estratto(
        '01/07/2026',
        '01/07/2026',
        'BONIFICO SEPA A FORNITORE DEMO ALFA SRL',
        1240,
        0
      ),
      estratto(
        '03/07/2026',
        '03/07/2026',
        'BONIFICO DA CLIENTE DEMO BETA SPA',
        0,
        3650
      ),
      estratto(
        '07/07/2026',
        '07/07/2026',
        'SDD UTENZA ELETTRICA SEDE DEMO',
        89.5,
        0
      ),
      estratto(
        '11/07/2026',
        '11/07/2026',
        'BONIFICO A FORNITORE DEMO GAMMA SNC',
        722.8,
        0
      ),
      estratto(
        '15/07/2026',
        '15/07/2026',
        'BONIFICO DA CLIENTE DEMO DELTA SRL',
        0,
        1464
      ),
      estratto(
        '18/07/2026',
        '18/07/2026',
        'ADDEBITO DELEGA F24 DEMO',
        246.4,
        0
      ),
      estratto(
        '02/07/2026',
        '02/07/2026',
        'BONIFICO CANONE LOCAZIONE UFFICIO DEMO',
        2100,
        0
      ),
      estratto(
        '21/07/2026',
        '21/07/2026',
        'ADDEBITO COMMISSIONI SERVIZIO POS DEMO',
        398.7,
        0
      ),
      estratto(
        '21/07/2026',
        '21/07/2026',
        'BONIFICO CLIENTE DEMO LAGO SRL',
        0,
        998.7
      ),
      estratto(
        '25/07/2026',
        '25/07/2026',
        'CANONE TRIMESTRALE CONTO CORRENTE DEMO',
        57.34,
        0
      )
    ]
  };

  function historyMovement(date, desc, dare, avere, source, valuta) {
    return {
      date,
      desc,
      dare,
      avere,
      source,
      valuta: valuta || date
    };
  }

  function historyPair(
    ecDate,
    ecDesc,
    ecDare,
    ecAvere,
    ptDate,
    ptDesc,
    ptDare,
    ptAvere,
    score
  ) {
    return {
      ec: historyMovement(
        ecDate,
        ecDesc,
        ecDare,
        ecAvere,
        ESTRATTO_SOURCE
      ),
      pt: historyMovement(
        ptDate,
        ptDesc,
        ptDare,
        ptAvere,
        PARTITARIO_SOURCE
      ),
      score
    };
  }

  const HISTORY_DATA = [
    {
      id: 'demo-analysis-2026-06-close',
      name: 'DEMO · Chiusura giugno 2026',
      created_at: '2026-07-28T10:15:00+02:00',
      num_partitari: 1,
      num_estratti: 1,
      num_movimenti_partitario: 6,
      num_movimenti_estratto: 6,
      num_match_esatti: 4,
      num_match_approx: 1,
      num_non_trovati: 2,
      is_starred: true,
      is_demo: true,
      read_only: true,
      matches_data: {
        exact: [
          historyPair(
            '03/06/2026',
            'BONIFICO FORNITORE DEMO QUERCIA SRL',
            2450,
            0,
            '03/06/2026',
            'PAGAMENTO FATTURA DEMO QUERCIA D-610',
            0,
            2450,
            1
          ),
          historyPair(
            '06/06/2026',
            'INCASSO CLIENTE DEMO AURORA SPA',
            0,
            976,
            '06/06/2026',
            'INCASSO FATTURA DEMO AURORA D-882',
            976,
            0,
            1
          ),
          historyPair(
            '12/06/2026',
            'SDD UTENZA GAS SEDE DEMO',
            132.4,
            0,
            '11/06/2026',
            'UTENZA GAS SEDE DEMO',
            0,
            132.4,
            0.93
          ),
          historyPair(
            '18/06/2026',
            'BONIFICO CLIENTE DEMO ORIZZONTE SRL',
            0,
            4200,
            '20/06/2026',
            'INCASSO CLIENTE DEMO ORIZZONTE D-901',
            4200,
            0,
            0.91
          )
        ],
        fuzzy: [
          historyPair(
            '24/06/2026',
            'ADDEBITO CARTA AZIENDALE DEMO',
            611.8,
            0,
            '24/06/2026',
            'SPESE CARTA AZIENDALE DEMO',
            0,
            620,
            0.81
          )
        ],
        unmatched_ec: [
          historyMovement(
            '30/06/2026',
            'COMMISSIONE BONIFICI MESE DEMO',
            18.5,
            0,
            ESTRATTO_SOURCE
          )
        ],
        unmatched_pt: [
          historyMovement(
            '30/06/2026',
            'RIMBORSO CASSA INTERNA DEMO',
            0,
            75,
            PARTITARIO_SOURCE
          )
        ]
      }
    },
    {
      id: 'demo-analysis-2026-06-first-half',
      name: 'DEMO · Prima metà di giugno 2026',
      created_at: '2026-07-15T16:40:00+02:00',
      num_partitari: 1,
      num_estratti: 1,
      num_movimenti_partitario: 5,
      num_movimenti_estratto: 6,
      num_match_esatti: 3,
      num_match_approx: 2,
      num_non_trovati: 1,
      is_starred: false,
      is_demo: true,
      read_only: true,
      matches_data: {
        exact: [
          historyPair(
            '02/06/2026',
            'BONIFICO STIPENDIO DIPENDENTE DEMO',
            1850,
            0,
            '02/06/2026',
            'STIPENDIO DIPENDENTE DEMO',
            0,
            1850,
            1
          ),
          historyPair(
            '05/06/2026',
            'BONIFICO CLIENTE DEMO CORALLO SRL',
            0,
            2440,
            '05/06/2026',
            'INCASSO CLIENTE DEMO CORALLO D-515',
            2440,
            0,
            1
          ),
          historyPair(
            '10/06/2026',
            'ADDEBITO DELEGA F24 DEMO',
            384.2,
            0,
            '12/06/2026',
            'VERSAMENTO F24 DEMO',
            0,
            384.2,
            0.91
          )
        ],
        fuzzy: [
          historyPair(
            '08/06/2026',
            'PAGAMENTO TRASPORTO MERCI DEMO',
            905,
            0,
            '08/06/2026',
            'FATTURA TRASPORTO MERCI DEMO',
            0,
            900,
            0.84
          ),
          historyPair(
            '14/06/2026',
            'PREMIO ASSICURATIVO UFFICIO DEMO',
            1180,
            0,
            '20/05/2026',
            'ASSICURAZIONE UFFICIO DEMO',
            0,
            1180,
            0.5
          )
        ],
        unmatched_ec: [
          historyMovement(
            '15/06/2026',
            'IMPOSTA DI BOLLO DEMO',
            8.5,
            0,
            ESTRATTO_SOURCE
          )
        ],
        unmatched_pt: []
      }
    },
    {
      id: 'demo-analysis-2026-05-check',
      name: 'DEMO · Verifica movimenti maggio 2026',
      created_at: '2026-07-03T09:05:00+02:00',
      num_partitari: 1,
      num_estratti: 1,
      num_movimenti_partitario: 4,
      num_movimenti_estratto: 4,
      num_match_esatti: 2,
      num_match_approx: 1,
      num_non_trovati: 2,
      is_starred: false,
      is_demo: true,
      read_only: true,
      matches_data: {
        exact: [
          historyPair(
            '07/05/2026',
            'BONIFICO CLIENTE DEMO FARO SPA',
            0,
            3294,
            '07/05/2026',
            'INCASSO CLIENTE DEMO FARO D-407',
            3294,
            0,
            1
          ),
          historyPair(
            '16/05/2026',
            'BONIFICO FORNITORE DEMO PINO SRL',
            540,
            0,
            '18/05/2026',
            'PAGAMENTO FORNITORE DEMO PINO D-118',
            0,
            540,
            0.91
          )
        ],
        fuzzy: [
          historyPair(
            '21/05/2026',
            'RIMBORSO SPESE TRASFERTA DEMO',
            312.45,
            0,
            '21/05/2026',
            'NOTA SPESE TRASFERTA DEMO',
            0,
            310,
            0.86
          )
        ],
        unmatched_ec: [
          historyMovement(
            '28/05/2026',
            'SPESE TENUTA CONTO DEMO',
            24,
            0,
            ESTRATTO_SOURCE
          )
        ],
        unmatched_pt: [
          historyMovement(
            '30/05/2026',
            'FATTURA DA INCASSARE CLIENTE DEMO NUVOLA SRL',
            760,
            0,
            PARTITARIO_SOURCE
          )
        ]
      }
    }
  ];

  global.DEMO_FIXTURES = Object.freeze({
    live: function () {
      return clone(LIVE_DATA);
    },
    history: function () {
      return clone(HISTORY_DATA);
    }
  });
})(window);
