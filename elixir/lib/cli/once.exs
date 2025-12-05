defmodule AdventOfCode.Cli.Once do
  @moduledoc """
  CLI to run a single task solution

  run by `mix start --task YEAR/TASK [--part a|b|both] [--run example|real|both]`
  """

  alias AdventOfCode.Cli.Utils
  alias AdventOfCode.Cli.Utils.InputParser
  alias AdventOfCode.Cli.Utils.SolutionHelper

  defp load_file(file_path) do
    case File.read(file_path) do
      {:ok, content} -> content
      {:error, _} -> raise "Could not read file: #{file_path}"
    end
  end

  defp load_input(solution_path, run) do
    filenames = %{example: "example_input", real: "input"}

    case Map.fetch(filenames, run) do
      {:ok, filename} -> Path.join([solution_path, filename]) |> load_file()
      :error -> raise ArgumentError, "Invalid run: #{inspect(run)}"
    end
  end

  defp load_output(solution_path, part, run) do
    filenames = %{example: "example_output", real: "output"}

    case Map.fetch(filenames, run) do
      {:ok, filename} ->
        Path.join([solution_path, filename])
        |> load_file()
        |> String.split("\n")
        |> Enum.at(if part == :part_a, do: 0, else: 1)

      :error ->
        raise ArgumentError, "Invalid run: #{inspect(run)}"
    end
  end

  defp check_output(actual, expected) do
    actual = actual |> to_string() |> String.trim()
    expected = expected |> to_string() |> String.trim()

    if actual == String.trim(expected) do
      IO.puts("✅ result: #{Utils.green(actual)} expected: #{expected}")
      :ok
    else
      IO.puts("❌ result: #{Utils.red(actual)} expected: #{expected}")
      :error
    end
  end

  def run(solution_path, parts, runs, year, task) do
    parts = if parts == :both, do: [:part_a, :part_b], else: List.wrap(parts)
    runs = if runs == :both, do: [:example, :real], else: List.wrap(runs)
    module = SolutionHelper.get_module(year, task)

    for part <- parts, run <- runs do
      IO.puts("#{part}, #{run}:")

      solution_path
      |> load_input(run)
      |> then(&module.prepare_input/1)
      |> then(&apply(module, part, [&1]))
      |> check_output(load_output(solution_path, part, run))
    end
  end

  def main() do
    %{part: part, run: run, year: year, task: task} = InputParser.parse(System.argv())

    solution_path = SolutionHelper.get_path(year, task)

    run(solution_path, part, run, year, task)

    System.at_exit(fn _ -> IO.write(IO.ANSI.reset()) end)
  end
end

AdventOfCode.Cli.Once.main()
