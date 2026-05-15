export interface BroadcastMatch {
  time: string
  home: string
  away: string
}

export interface BroadcastDay {
  date: string
  displayDate: string
  matches: BroadcastMatch[]
  artists: string[]
}

export const SCHEDULE: BroadcastDay[] = [
  { date: '2026-06-11', displayDate: '11 Jun', matches: [{ time: '20H', home: 'México', away: 'África do Sul' }], artists: ['Jorge Guerreiro'] },
  { date: '2026-06-12', displayDate: '12 Jun', matches: [{ time: '20H', home: 'Canadá', away: 'Bósnia' }], artists: ['Primeira Companhia'] },
  { date: '2026-06-13', displayDate: '13 Jun', matches: [{ time: '22H', home: 'Catar', away: 'Suíça' }, { time: '23H', home: 'Brasil', away: 'Marrocos' }], artists: ['Bruna Lennon'] },
  { date: '2026-06-14', displayDate: '14 Jun', matches: [{ time: '18H', home: 'Alemanha', away: 'Curaçao' }, { time: '21H', home: 'Holanda', away: 'Japão' }, { time: '00H', home: 'Costa do Marfim', away: 'Equador' }], artists: ['Silva Lining Band'] },
  { date: '2026-06-15', displayDate: '15 Jun', matches: [{ time: '17H', home: 'Espanha', away: 'Cabo Verde' }, { time: '20H', home: 'Bélgica', away: 'Egito' }, { time: '23H', home: 'Arábia Saudita', away: 'Uruguai' }], artists: ['Rony Fuego'] },
  { date: '2026-06-16', displayDate: '16 Jun', matches: [{ time: '20H', home: 'França', away: 'Senegal' }, { time: '23H', home: 'Iraque', away: 'Noruega' }], artists: ['Ben Colton'] },
  { date: '2026-06-17', displayDate: '17 Jun', matches: [{ time: '18H', home: 'Portugal', away: 'R.D. Congo' }, { time: '21H', home: 'Inglaterra', away: 'Croácia' }, { time: '00H', home: 'Gana', away: 'Panamá' }], artists: ['Nonstop'] },
  { date: '2026-06-18', displayDate: '18 Jun', matches: [{ time: '17H', home: 'República Checa', away: 'África do Sul' }, { time: '20H', home: 'Suíça', away: 'Bósnia' }, { time: '23H', home: 'Canadá', away: 'Catar' }], artists: ['Ruben da Cruz'] },
  { date: '2026-06-19', displayDate: '19 Jun', matches: [{ time: '20H', home: 'EUA', away: 'Austrália' }, { time: '23H', home: 'Escócia', away: 'Marrocos' }, { time: '01H30', home: 'Brasil', away: 'Haiti' }], artists: ['Brasileirada'] },
  { date: '2026-06-20', displayDate: '20 Jun', matches: [{ time: '18H', home: 'Holanda', away: 'Suécia' }, { time: '21H', home: 'Alemanha', away: 'Costa do Marfim' }], artists: ['DJ Overule'] },
  { date: '2026-06-21', displayDate: '21 Jun', matches: [{ time: '17H', home: 'Espanha', away: 'Arábia Saudita' }, { time: '20H', home: 'Bélgica', away: 'Irão' }, { time: '23H', home: 'Uruguai', away: 'Cabo Verde' }], artists: ['Soraia Ramos'] },
  { date: '2026-06-22', displayDate: '22 Jun', matches: [{ time: '18H', home: 'Argentina', away: 'Áustria' }, { time: '22H', home: 'França', away: 'Iraque' }], artists: ['Cumbia'] },
  { date: '2026-06-23', displayDate: '23 Jun', matches: [{ time: '18H', home: 'Portugal', away: 'Uzbequistão' }, { time: '21H', home: 'Inglaterra', away: 'Gana' }, { time: '00H', home: 'Panamá', away: 'Croácia' }], artists: ['Dillaz / Wet Bad Gang'] },
  { date: '2026-06-24', displayDate: '24 Jun', matches: [{ time: '20H', home: 'Suíça', away: 'Canadá' }, { time: '20H', home: 'Bósnia', away: 'Catar' }, { time: '23H', home: 'Marrocos', away: 'Haiti' }, { time: '23H', home: 'Escócia', away: 'Brasil' }], artists: ['Roda de Samba'] },
  { date: '2026-06-25', displayDate: '25 Jun', matches: [{ time: '21H', home: 'Curaçao', away: 'Costa do Marfim' }, { time: '21H', home: 'Equador', away: 'Alemanha' }, { time: '00H', home: 'Tunísia', away: 'Holanda' }, { time: '00H', home: 'Japão', away: 'Suécia' }], artists: ['Kiko Is Hot'] },
  { date: '2026-06-26', displayDate: '26 Jun', matches: [{ time: '20H', home: 'Noruega', away: 'França' }, { time: '20H', home: 'Senegal', away: 'Iraque' }, { time: '01H', home: 'Cabo Verde', away: 'Arábia Saudita' }, { time: '01H', home: 'Uruguai', away: 'Espanha' }], artists: ['DJ Marques'] },
  { date: '2026-06-27', displayDate: '27 Jun', matches: [{ time: '22H', home: 'Panamá', away: 'Inglaterra' }, { time: '22H', home: 'Croácia', away: 'Gana' }, { time: '00H30', home: 'Colômbia', away: 'Portugal' }, { time: '00H30', home: 'R.D. Congo', away: 'Uzbequistão' }], artists: ['Força Suprema'] },
  { date: '2026-06-28', displayDate: '28 Jun', matches: [{ time: '20H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-06-29', displayDate: '29 Jun', matches: [{ time: '18H', home: 'TBA', away: 'TBA' }, { time: '21H30', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-06-30', displayDate: '30 Jun', matches: [{ time: '18H', home: 'TBA', away: 'TBA' }, { time: '22H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-01', displayDate: '1 Jul', matches: [{ time: '17H', home: 'TBA', away: 'TBA' }, { time: '21H', home: 'TBA', away: 'TBA' }, { time: '01H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-02', displayDate: '2 Jul', matches: [{ time: '20H', home: 'TBA', away: 'TBA' }, { time: '00H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-03', displayDate: '3 Jul', matches: [{ time: '19H', home: 'TBA', away: 'TBA' }, { time: '23H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-04', displayDate: '4 Jul', matches: [{ time: '18H', home: 'TBA', away: 'TBA' }, { time: '22H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-05', displayDate: '5 Jul', matches: [{ time: '21H', home: 'TBA', away: 'TBA' }, { time: '01H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-06', displayDate: '6 Jul', matches: [{ time: '20H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-07', displayDate: '7 Jul', matches: [{ time: '07H', home: 'TBA', away: 'TBA' }, { time: '17H', home: 'TBA', away: 'TBA' }, { time: '21H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-09', displayDate: '9 Jul', matches: [{ time: '21H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-10', displayDate: '10 Jul', matches: [{ time: '20H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-11', displayDate: '11 Jul', matches: [{ time: '22H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-14', displayDate: '14 Jul', matches: [{ time: '20H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-15', displayDate: '15 Jul', matches: [{ time: '20H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-18', displayDate: '18 Jul', matches: [{ time: '22H', home: 'TBA', away: 'TBA' }], artists: [] },
  { date: '2026-07-19', displayDate: '19 Jul', matches: [{ time: '20H', home: 'TBA', away: 'TBA' }], artists: [] },
]
