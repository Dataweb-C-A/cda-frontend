export interface IAdnoucement {
  url: string
}

interface IRaffleCombos { 
  quantity: number;
  price: number;
}

export interface IRaffle {
  id: number;
  ad: null | IAdnoucement;
  title: string;
  draw_type: string;
  status: string;
  limit: number;
  money: string;
  raffle_type: string;
  price_unit: number;
  tickets_count: number;
  numbers: number;
  lotery: string;
  expired_date: null | string;
  init_date: string;
  prizes: IPrize[];
  winners: null | any;
  has_winners: boolean;
  automatic_taquillas_ids: number[];
  shared_user_id: number;
  created_at: string;
  updated_at: string;
  combos: IRaffleCombos[] | null
}

export interface IPrize {
  name: string;
  prize_position: number;
}