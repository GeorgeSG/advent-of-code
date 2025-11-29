defmodule AdventOfCode.Cli.Start do
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
    actual = String.trim(to_string(actual))

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

  def run(solution_path, part, run, year, task) do
    parts =
      case part do
        :both -> [:part_a, :part_b]
        other -> [other]
      end

    runs =
      case run do
        :both -> [:example, :real]
        other -> [other]
      end

    for p <- parts, r <- runs do
      IO.puts("#{p}, #{r}:")
      input = load_input(solution_path, r)
      expected_output = load_output(solution_path, r)

      prepared_input =
        get_module(year, task)
        |> apply(:prepare_input, [input])

      get_module(year, task)
      |> apply(p, [prepared_input])
      |> check_output(expected_output)
    end
  end

  def main() do
    {opts, _, _} =
      OptionParser.parse(System.argv(),
        strict: [part: :string, run: :string, task: :string],
        aliases: [p: :part, r: :run, t: :task]
      )

    run =
      case Keyword.get(opts, :run, "both") do
        "example" ->
          :example

        "real" ->
          :real

        "both" ->
          :both

        other ->
          IO.puts("Invalid --run: #{other}. Expected one of: example, real, both")
          exit(1)
      end

    part =
      case Keyword.get(opts, :part, "both") do
        "a" ->
          :part_a

        "b" ->
          :part_b

        "both" ->
          :both

        other ->
          IO.puts("Invalid --part: #{other}. Expected one of: a, b, both")
          exit(1)
      end

    task_input =
      opts
      |> Keyword.get(:task, "")
      |> String.trim()
      |> case do
        "" -> raise ArgumentError, "must select task (use --task YEAR/TASK)"
        value -> value
      end

    [year, task] = String.split(task_input, "/", parts: 2)

    solution_path = Path.join([__DIR__, "..", "solutions", year, task])

    run(solution_path, part, run, year, task)

    System.at_exit(fn _ -> IO.write(IO.ANSI.reset()) end)
  end
end

AdventOfCode.Cli.Start.main()
