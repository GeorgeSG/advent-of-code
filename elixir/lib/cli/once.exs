defmodule AdventOfCode.Cli.Once do
  @moduledoc """
  CLI to run a single task solution

  run by `mix start --task YEAR/TASK [--part a|b|both] [--run example|real|both]`
  """

  alias AdventOfCode.Cli.Utils

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

  defp load_output(solution_path, run) do
    filenames = %{example: "example_output", real: "output"}

    case Map.fetch(filenames, run) do
      {:ok, filename} -> Path.join([solution_path, filename]) |> load_file()
      :error -> raise ArgumentError, "Invalid run: #{inspect(run)}"
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

  defp get_module(year, task) do
    "AdventOfCode.Solutions#{year}.Task#{task}"
    |> String.split(".")
    |> Enum.map(&String.to_atom/1)
    |> Module.concat()
  end

  def run(solution_path, parts, runs, year, task) do
    parts = if parts == :both, do: [:part_a, :part_b], else: List.wrap(part)
    runs = if runs == :both, do: [:example, :real], else: List.wrap(run)
    module = get_module(year, task)

    for part <- parts, run <- runs do
      IO.puts("#{part}, #{run}:")

      solution_path
      |> load_input(run)
      |> then(&module.prepare_input/1)
      |> then(&apply(module, part, [&1]))
      |> check_output(load_output(solution_path, run))
    end
  end

  def main() do
    {opts, _, _} =
      OptionParser.parse(System.argv(),
        strict: [part: :string, run: :string, task: :string],
        aliases: [p: :part, r: :run, t: :task]
      )

    run_mapping = %{"example" => :example, "real" => :real, "both" => :both}

    run =
      opts
      |> Keyword.get(:run, "both")
      |> then(&Map.fetch(run_mapping, &1))
      |> case do
        {:ok, value} ->
          value

        :error ->
          IO.puts("Invalid --run: #{other}. Expected one of: example, real, both")
          exit(1)
      end

    part_mapping = %{"a" => :part_a, "b" => :part_b, "both" => :both}

    part =
      opts
      |> Keyword.get(:part, "both")
      |> then(&Map.fetch(part_mapping, &1))
      |> case do
        {:ok, value} ->
          value

        :error ->
          IO.puts("Invalid --part: #{other}. Expected one of: example, real, both")
          exit(1)
      end

    task_input =
      opts
      |> Keyword.get(:task, "")
      |> String.trim()
      |> case do
        value -> value
        "" -> raise ArgumentError, "must select task (use --task YEAR/TASK)"
      end

    [year, task] = String.split(task_input, "/", parts: 2)

    solution_path = Path.join([__DIR__, "..", "solutions", year, task])

    run(solution_path, part, run, year, task)

    System.at_exit(fn _ -> IO.write(IO.ANSI.reset()) end)
  end
end

AdventOfCode.Cli.Once.main()
