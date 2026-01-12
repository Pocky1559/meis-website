import { supabase } from "../scripts/supabase-cilent.js";

const { data, error } = await supabase
    .from('teacher-info')
    .select();

console.log(data, error);