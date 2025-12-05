defmodule AdventOfCode.Solutions2025.Task01 do
  @start 50
  @target 0

  defp parse_line("L" <> num), do: -1 * String.to_integer(num)
  defp parse_line("R" <> num), do: String.to_integer(num)

  def prepare_input(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(&parse_line/1)
  end

  def part_a(rotations) do
    rotations
    |> Enum.scan(@start, &Integer.mod(&1 + &2, 100))
    |> Enum.count(&(&1 == @target))
  end

  defp get_clicks(delta, dial) do
    clicks = div(abs(delta), 100)
    sum = dial + rem(delta, 100)

    if dial != @target and (sum <= 0 or sum >= 100) do
      clicks + 1
    else
      clicks
    end
  end

  def part_b(rotations) do
    {_, clicks} =
      Enum.reduce(rotations, {@start, 0}, fn rotation, {dial, clicks} ->
        new_clicks = get_clicks(rotation, dial)
        new_dial = Integer.mod(dial + rotation, 100)

        {new_dial, clicks + new_clicks}
      end)

    clicks
  end
end
