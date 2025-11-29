defmodule AdventOfCode.Cli.Utils.InputParser do
  @moduledoc """
  Utility module for parsing CLI options
  """

  def parse(system_args) do
    {input, _, _} =
      OptionParser.parse(system_args,
        strict: [part: :string, run: :string, task: :string],
        aliases: [p: :part, r: :run, t: :task]
      )

    {year, task} = get_task(input)

    %{
      part: get_part(input),
      run: get_run(input),
      year: year,
      task: task
    }
  end

  def get_part(input) do
    part_mapping = %{"a" => :part_a, "b" => :part_b, "both" => :both}

    input
    |> Keyword.get(:part, "both")
    |> then(&Map.fetch(part_mapping, &1))
    |> case do
      {:ok, value} ->
        value

      :error ->
        IO.puts("Invalid --part: #{Keyword.get(input, :part)}. Expected one of: a, b, both")

        System.halt(1)
    end
  end

  def get_run(input) do
    run_mapping = %{"example" => :example, "real" => :real, "both" => :both}

    input
    |> Keyword.get(:run, "both")
    |> then(&Map.fetch(run_mapping, &1))
    |> case do
      {:ok, value} ->
        value

      :error ->
        IO.puts(
          "Invalid --run: #{Keyword.get(input, :run)}. Expected one of: example, real, both"
        )

        System.halt(1)
    end
  end

  def get_task(input) do
    task_input =
      input
      |> Keyword.get(:task, "")
      |> String.trim()
      |> case do
        "" ->
          IO.puts("must select task (use --task YEAR/TASK)")
          System.halt(1)

        value ->
          value
      end

    [year, task] = String.split(task_input, "/", parts: 2)

    {year, task}
  end
end
