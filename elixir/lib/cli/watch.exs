defmodule AdventOfCode.Cli.Watch do
  @moduledoc """
  CLI to watch a solution file and re-run the `once` script on changes

  run by `mix watch --task YEAR/TASK [--part a|b|both] [--run example|real|both]`
  """

  alias AdventOfCode.Cli.Utils.InputParser
  alias AdventOfCode.Cli.Utils.SolutionHelper

  def main() do
    input = InputParser.parse(System.argv())

    solution_path = SolutionHelper.get_file_path(input.year, input.task)
    absolute_solution_path = Path.expand(solution_path)

    # Ensure the file exists
    unless File.exists?(absolute_solution_path) do
      IO.puts("Error: Solution file not found at #{absolute_solution_path}")
      System.halt(1)
    end

    IO.puts("👀 Watching #{solution_path} for changes...")
    IO.puts("Press Ctrl+C to stop\n")

    # Run once initially
    run_once(input)

    # Start watching
    {:ok, pid} = FileSystem.start_link(dirs: [Path.dirname(absolute_solution_path)])
    FileSystem.subscribe(pid)

    watch_loop(input)
  end

  defp run_once(input) do
    args = [
      "--run",
      to_string(input.run),
      "--part",
      to_string(input.part),
      "--task",
      "#{input.year}/#{input.task}"
    ]

    IO.puts("\n" <> String.duplicate("=", 80))
    IO.puts("Running solution at #{DateTime.utc_now() |> DateTime.to_string()}")
    IO.puts(String.duplicate("=", 80) <> "\n")

    case System.cmd("mix", ["once" | args], into: IO.stream(), stderr_to_stdout: true) do
      {_, 0} -> :ok
      {_, _} -> IO.puts("\n⚠️  Command failed")
    end
  end

  defp watch_loop(input) do
    receive do
      {:file_event, _pid, {path, events}} ->
        # Only react to modify or create events, ignore remove
        if Enum.any?([:modified, :created], &(&1 in events)) and
             Path.extname(path) == ".ex" do
          # Small delay to ensure file is fully written
          Process.sleep(100)
          run_once(input)
        end

        watch_loop(input)

      {:file_event, _pid, :stop} ->
        IO.puts("\nFile watcher stopped")
        :ok
    end
  end
end

AdventOfCode.Cli.Watch.main()
